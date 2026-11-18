function unsplash(id, largura = 1200) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${largura}&q=80`;
}

export const fotos = {
  salao: unsplash('photo-1675599193990-33d71150902b', 1400),
  espelho: unsplash('photo-1702865272115-5afdbae975af'),
  cadeira: unsplash('photo-1621645582931-d1d3e6564943'),
  listrada: unsplash('photo-1638383257225-f810a62c634e'),
  couro: unsplash('photo-1611313151697-d626e818dddf'),
  poltrona: unsplash('photo-1629881544138-c45fc917eb81'),
  corte: unsplash('photo-1672642150228-3fcd5826ec26'),
  barba: unsplash('photo-1494873446894-adbfecfc407a'),
};

export const galeria = [
  fotos.salao,
  fotos.espelho,
  fotos.poltrona,
  fotos.listrada,
  fotos.couro,
  fotos.cadeira,
];
