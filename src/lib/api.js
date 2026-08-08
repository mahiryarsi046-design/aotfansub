export async function getTopAnime() {
  // Jikan API yerine doğrudan çalışan örnek anime listesi
  return [
    {
      mal_id: 1,
      title: "Attack on Titan",
      title_japanese: "進撃の巨人",
      score: 9.1,
      episodes: 89,
      images: { jpg: { large_image_url: "https://cdn.myanimelist.net/images/anime/10/47347.jpg" } }
    },
    {
      mal_id: 2,
      title: "Jujutsu Kaisen",
      title_japanese: "呪術廻戦",
      score: 8.6,
      episodes: 24,
      images: { jpg: { large_image_url: "https://cdn.myanimelist.net/images/anime/1171/109222.jpg" } }
    },
    {
      mal_id: 3,
      title: "Bleach",
      title_japanese: "ブリーチ",
      score: 7.9,
      episodes: 366,
      images: { jpg: { large_image_url: "https://cdn.myanimelist.net/images/anime/3/40451.jpg" } }
    },
    {
      mal_id: 4,
      title: "Death Note",
      title_japanese: "デスノート",
      score: 8.6,
      episodes: 37,
      images: { jpg: { large_image_url: "https://cdn.myanimelist.net/images/anime/9/9453.jpg" } }
    },
    {
      mal_id: 5,
      title: "Fullmetal Alchemist: Brotherhood",
      title_japanese: "鋼の錬金術師",
      score: 9.1,
      episodes: 64,
      images: { jpg: { large_image_url: "https://cdn.myanimelist.net/images/anime/1223/96541.jpg" } }
    }
  ];
}

export async function getTopManga() {
  // Örnek popüler manga ve webtoon listesi
  return [
    {
      mal_id: 101,
      title: "Solo Leveling",
      title_japanese: "나 혼자만 레벨업",
      score: 8.7,
      chapters: 200,
      images: { jpg: { large_image_url: "https://cdn.myanimelist.net/images/manga/3/222205.jpg" } }
    },
    {
      mal_id: 102,
      title: "Berserk",
      title_japanese: "ベルセルク",
      score: 9.4,
      chapters: 364,
      images: { jpg: { large_image_url: "https://cdn.myanimelist.net/images/manga/1/157897.jpg" } }
    },
    {
      mal_id: 103,
      title: "Chainsaw Man",
      title_japanese: "チェンソーマン",
      score: 8.5,
      chapters: 140,
      images: { jpg: { large_image_url: "https://cdn.myanimelist.net/images/manga/2/216464.jpg" } }
    },
    {
      mal_id: 104,
      title: "Vagabond",
      title_japanese: "バガボンド",
      score: 9.2,
      chapters: 327,
      images: { jpg: { large_image_url: "https://cdn.myanimelist.net/images/manga/1/259070.jpg" } }
    },
    {
      mal_id: 105,
      title: "Oyasumi Punpun",
      title_japanese: "おやすみプンプン",
      score: 9.0,
      chapters: 147,
      images: { jpg: { large_image_url: "https://cdn.myanimelist.net/images/manga/3/135043.jpg" } }
    }
  ];
}