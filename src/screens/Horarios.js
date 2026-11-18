import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';
import Text from '../components/Texto';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import useApi from '../hooks/useApi';
import useServicos from '../hooks/useServicos';
import Chip from '../components/Chip';
import FundoFoto from '../components/FundoFoto';
import { fotos } from '../data/fotos';
import { funcionamento, intervaloMinutos } from '../data/barbearia';
import { cores } from '../theme/cores';
import { dataISO, horaParaMinutos, minutosParaHora, moeda } from '../utils/formatar';
import { avisar, confirmar } from '../utils/dialogo';

const nomesCurtos = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

function proximosDias(quantidade) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  return Array.from({ length: quantidade }, (_, i) => {
    const data = new Date(hoje);
    data.setDate(hoje.getDate() + i);
    const regra = funcionamento[data.getDay()];
    return {
      iso: dataISO(data),
      data,
      semana: i === 0 ? 'Hoje' : nomesCurtos[data.getDay()],
      dia: data.getDate(),
      mes: meses[data.getMonth()],
      regra,
      fechado: !regra.abre,
    };
  });
}

function gerarHorarios(dia) {
  if (dia.fechado) return [];
  const inicio = horaParaMinutos(dia.regra.abre);
  const fim = horaParaMinutos(dia.regra.fecha);
  const agora = new Date();
  const ehHoje = dia.iso === dataISO(agora);
  const minutosAgora = agora.getHours() * 60 + agora.getMinutes();
  const lista = [];
  for (let m = inicio; m < fim; m += intervaloMinutos) {
    lista.push({ hora: minutosParaHora(m), passado: ehHoje && m <= minutosAgora });
  }
  return lista;
}

export default function Horarios({ route }) {
  const { usuario } = useAuth();
  const { servicos, carregando: carregandoServicos } = useServicos();
  const { width } = useWindowDimensions();

  const dias = useMemo(() => proximosDias(14), []);
  const [diaSelecionado, setDiaSelecionado] = useState(
    () => dias.find((d) => gerarHorarios(d).some((h) => !h.passado)) || dias[0]
  );
  const [servicoId, setServicoId] = useState(route.params?.servicoId || null);
  const [processando, setProcessando] = useState(null);
  const {
    dados: lista,
    carregando,
    erro,
    recarregar,
  } = useApi(`/agendamentos?data=${diaSelecionado.iso}`);

  useEffect(() => {
    if (route.params?.servicoId) setServicoId(route.params.servicoId);
  }, [route.params?.servicoId]);

  useEffect(() => {
    if (!servicoId && servicos.length) setServicoId(servicos[0].id);
  }, [servicos, servicoId]);

  const agendamentos = useMemo(() => {
    const mapa = {};
    (lista || []).forEach((a) => {
      mapa[a.hora] = a;
    });
    return mapa;
  }, [lista]);

  const horarios = useMemo(() => gerarHorarios(diaSelecionado), [diaSelecionado]);
  const servico = servicos.find((s) => s.id === servicoId);
  const larguraHorario = (Math.min(width, 600) - 40 - 8 * 3) / 4;
  const hojeSemana = new Date().getDay();

  function reservar(hora) {
    if (!servico) {
      avisar('Escolha um serviço', 'Selecione o serviço antes de reservar o horário.');
      return;
    }
    const titulo = `${diaSelecionado.semana}, ${diaSelecionado.dia} ${diaSelecionado.mes} às ${hora}`;
    confirmar('Confirmar reserva', `${servico.nome} - ${moeda(servico.preco)}\n${titulo}`, async () => {
      setProcessando(hora);
      try {
        await api('/agendamentos', {
          metodo: 'POST',
          corpo: { data: diaSelecionado.iso, hora, servicoId: servico.id },
        });
        avisar('Horário reservado!', `Te esperamos ${titulo}.`);
      } catch (e) {
        avisar('Não foi possível reservar', e.message);
      } finally {
        await recarregar();
        setProcessando(null);
      }
    });
  }

  function cancelar(agendamento) {
    confirmar(
      'Cancelar horário',
      `Deseja cancelar ${agendamento.servico} às ${agendamento.hora}?`,
      async () => {
        setProcessando(agendamento.hora);
        try {
          await api(`/agendamentos/${agendamento.id}`, { metodo: 'DELETE' });
        } catch (e) {
          avisar('Erro', e.message);
        } finally {
          await recarregar();
          setProcessando(null);
        }
      },
      'Cancelar horário',
      true
    );
  }

  function tocarHorario(item) {
    const agendamento = agendamentos[item.hora];
    if (agendamento && agendamento.usuario === usuario.id) {
      cancelar(agendamento);
      return;
    }
    if (agendamento || item.passado) return;
    reservar(item.hora);
  }

  return (
    <ScrollView
      style={mascara.casca}
      contentContainerStyle={mascara.conteudo}
      refreshControl={<RefreshControl refreshing={false} onRefresh={recarregar} tintColor={cores.dourado} />}
    >
      <FundoFoto
        foto={fotos.cadeira}
        degrade={['rgba(20,17,15,0.05)', 'rgba(20,17,15,0.55)', 'rgba(20,17,15,0.95)']}
        style={mascara.banner}
      >
        <Text style={mascara.bannerTitulo}>Reserve sua cadeira</Text>
        <Text style={mascara.bannerTexto}>Escolha o serviço, o dia e o horário.</Text>
      </FundoFoto>

      <View style={mascara.cartao}>
        <View style={mascara.cartaoTopo}>
          <MaterialCommunityIcons name="clock-outline" size={20} color={cores.dourado} />
          <Text style={mascara.cartaoTitulo}>Funcionamento</Text>
        </View>
        {funcionamento.map((f) => (
          <View key={f.dia} style={[mascara.linhaSemana, f.dia === hojeSemana && mascara.linhaHoje]}>
            <Text style={[mascara.semanaNome, f.dia === hojeSemana && mascara.textoHoje]}>{f.nome}</Text>
            <Text style={[mascara.semanaHora, !f.abre && mascara.fechado, f.dia === hojeSemana && mascara.textoHoje]}>
              {f.abre ? `${f.abre} às ${f.fecha}` : 'Fechado'}
            </Text>
          </View>
        ))}
      </View>

      <Text style={mascara.secao}>Serviço</Text>
      {carregandoServicos ? (
        <ActivityIndicator color={cores.dourado} style={mascara.indicador} />
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={mascara.faixa}>
          {servicos.map((s) => (
            <Chip
              key={s.id}
              texto={s.nome}
              icone={s.icone}
              ativo={s.id === servicoId}
              onPress={() => setServicoId(s.id)}
            />
          ))}
        </ScrollView>
      )}
      {servico ? (
        <Text style={mascara.resumoServico}>
          {servico.duracao} min · {moeda(servico.preco)}
        </Text>
      ) : null}

      <Text style={mascara.secao}>Dia</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={mascara.faixa}>
        {dias.map((d) => {
          const ativo = d.iso === diaSelecionado.iso;
          return (
            <TouchableOpacity
              key={d.iso}
              disabled={d.fechado}
              onPress={() => setDiaSelecionado(d)}
              style={[mascara.dia, ativo && mascara.diaAtivo, d.fechado && mascara.diaFechado]}
            >
              <Text style={[mascara.diaSemana, ativo && mascara.diaTextoAtivo]}>{d.semana}</Text>
              <Text style={[mascara.diaNumero, ativo && mascara.diaTextoAtivo]}>{d.dia}</Text>
              <Text style={[mascara.diaMes, ativo && mascara.diaTextoAtivo]}>{d.fechado ? 'fechado' : d.mes}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={mascara.legenda}>
        <Legenda cor={cores.superficie} borda={cores.borda} texto="Livre" />
        <Legenda cor={cores.superficieAlta} borda={cores.superficieAlta} texto="Ocupado" />
        <Legenda cor={cores.dourado} borda={cores.dourado} texto="Seu horário" />
      </View>

      {erro ? <Text style={mascara.erro}>{erro}</Text> : null}

      {carregando ? (
        <ActivityIndicator color={cores.dourado} style={mascara.indicador} />
      ) : (
        <View style={mascara.grade}>
          {horarios.map((item) => {
            const agendamento = agendamentos[item.hora];
            const meu = !!agendamento && agendamento.usuario === usuario.id;
            const ocupado = !!agendamento && !meu;
            const bloqueado = ocupado || item.passado;
            return (
              <TouchableOpacity
                key={item.hora}
                activeOpacity={0.8}
                disabled={bloqueado || processando !== null}
                onPress={() => tocarHorario(item)}
                style={[
                  mascara.horario,
                  { width: larguraHorario },
                  ocupado && mascara.horarioOcupado,
                  item.passado && !agendamento && mascara.horarioPassado,
                  meu && mascara.horarioMeu,
                ]}
              >
                {processando === item.hora ? (
                  <ActivityIndicator size="small" color={meu ? cores.fundo : cores.dourado} />
                ) : (
                  <Text
                    style={[
                      mascara.horarioTexto,
                      bloqueado && mascara.horarioTextoBloqueado,
                      meu && mascara.horarioTextoMeu,
                    ]}
                  >
                    {item.hora}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <Text style={mascara.dica}>Toque em um horário livre para reservar. Toque no seu horário para cancelar.</Text>
    </ScrollView>
  );
}

function Legenda({ cor, borda, texto }) {
  return (
    <View style={mascara.legendaItem}>
      <View style={[mascara.legendaCor, { backgroundColor: cor, borderColor: borda }]} />
      <Text style={mascara.legendaTexto}>{texto}</Text>
    </View>
  );
}

const mascara = StyleSheet.create({
  casca: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  conteudo: {
    padding: 20,
    paddingBottom: 40,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  banner: {
    height: 170,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: cores.borda,
    padding: 18,
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  bannerTitulo: {
    color: cores.creme,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  bannerTexto: {
    color: '#D8CCB8',
    fontSize: 14,
    marginTop: 4,
  },
  cartao: {
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 16,
    padding: 16,
  },
  cartaoTopo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  cartaoTitulo: {
    color: cores.creme,
    fontWeight: '800',
    letterSpacing: -0.5,
    fontSize: 18,
  },
  linhaSemana: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  linhaHoje: {
    backgroundColor: cores.superficieAlta,
  },
  semanaNome: {
    color: cores.textoSecundario,
    fontSize: 14,
  },
  semanaHora: {
    color: cores.creme,
    fontSize: 14,
    fontWeight: '600',
  },
  textoHoje: {
    color: cores.dourado,
    fontWeight: '700',
  },
  fechado: {
    color: cores.vermelho,
  },
  secao: {
    color: cores.textoSecundario,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 24,
    marginBottom: 10,
  },
  faixa: {
    flexGrow: 0,
  },
  resumoServico: {
    color: cores.textoSecundario,
    fontSize: 13,
    marginTop: 8,
  },
  indicador: {
    marginVertical: 16,
  },
  dia: {
    width: 62,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.superficie,
    alignItems: 'center',
    marginRight: 8,
  },
  diaAtivo: {
    backgroundColor: cores.dourado,
    borderColor: cores.dourado,
  },
  diaFechado: {
    opacity: 0.35,
  },
  diaSemana: {
    color: cores.textoSecundario,
    fontSize: 12,
    fontWeight: '600',
  },
  diaNumero: {
    color: cores.creme,
    fontSize: 22,
    fontWeight: '800',
    marginVertical: 2,
  },
  diaMes: {
    color: cores.textoSecundario,
    fontSize: 11,
  },
  diaTextoAtivo: {
    color: cores.fundo,
  },
  legenda: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  legendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendaCor: {
    width: 14,
    height: 14,
    borderRadius: 4,
    borderWidth: 1,
  },
  legendaTexto: {
    color: cores.textoSecundario,
    fontSize: 12,
  },
  grade: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  horario: {
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.superficie,
    alignItems: 'center',
    justifyContent: 'center',
  },
  horarioOcupado: {
    backgroundColor: cores.superficieAlta,
    borderColor: cores.superficieAlta,
  },
  horarioPassado: {
    opacity: 0.35,
  },
  horarioMeu: {
    backgroundColor: cores.dourado,
    borderColor: cores.dourado,
  },
  horarioTexto: {
    color: cores.creme,
    fontSize: 15,
    fontWeight: '700',
  },
  horarioTextoBloqueado: {
    color: cores.textoApagado,
    textDecorationLine: 'line-through',
  },
  horarioTextoMeu: {
    color: cores.fundo,
    textDecorationLine: 'none',
  },
  erro: {
    color: '#E0786D',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 12,
  },
  dica: {
    color: cores.textoApagado,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
  },
});
