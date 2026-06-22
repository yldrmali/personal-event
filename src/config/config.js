const config = {
  data: {
    title: "Ali & Nebile Evleniyor",
    description:
      "Sizi bu özel günümüzde aramızda görmekten büyük mutluluk duyacağız.",

    groom: {
      firstName: "Ali",
      lastName: "YILDIRIM",
      father: "Ziya YILDIRIM",
      mother: "Sevgi YILDIRIM"
    },

    bride: {
      firstName: "Nebile",
      lastName: "ASLAN",
      father: "İsmet ASLAN",
      mother: "Hatun ASLAN"
    },

    kina: {
      date: "2026-08-08",
      startTime: "19:00",
      endTime: "23:00",
      location: "Tılsım Butik Kır Bahçesi",
      address: "Çakallar, Çakallar Cd. No:86/1, Amasya",
      // maps_url  → short link for the "Yol Tarifi Al" button (maps.app.goo.gl is fine here)
      // maps_embed → must be the EMBED URL from Google Maps:
      //              Maps → location → Share → Embed a map → copy the src="..." value
      //              It starts with https://www.google.com/maps/embed?pb=
      maps_url: "https://maps.app.goo.gl/Wk442zxXb4NGneaw9",
      maps_embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3027.330192272004!2d35.83115201174107!3d40.6446512712846!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40876fb5c70ff267%3A0xf471425b025bdbe9!2zVMSxbHPEsW0gQnV0aWsgS8SxciBCYWjDp2VzaSAmIMOHb2sgQW1hw6dsxLEgU2Fsb24!5e0!3m2!1str!2str!4v1782151886432!5m2!1str!2str",
    },

    nikah: {
      date: "2026-08-15",
      startTime: "17:00",
      endTime: "18:00",
      location: "Şehitkamil Belediyesi Nikah Salonu",
      address: "Merveşehir, Mehmet Erdemoğlu Cd., 27590 Şehitkamil/Gaziantep",
      maps_url: "https://maps.app.goo.gl/srSsXG1S2gLHEDJbA",
      maps_embed:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3182.3876034162863!2d37.38787981157762!3d37.09588997204817!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1531e5813c787969%3A0xd5c094224df5197c!2s%C5%9Eehitkamil%20Belediyesi%20Nikah%20Salonu!5e0!3m2!1str!2str!4v1782151400544!5m2!1str!2str",
    },

    favicon: "/favicon.svg",

    agenda: [
      {
        title: "Kına Gecesi",
        date: "2026-08-08",
        startTime: "19:00",
        endTime: "23:00",
        location: "Tılsım Butik Kır Bahçesi",
        address: "Çakallar, Çakallar Cd. No:86/1, Amasya",
      },
      {
        title: "Nikah Töreni",
        date: "2026-08-15",
        startTime: "17:00",
        endTime: "18:00",
        location: "Şehitkamil Belediyesi Nikah Salonu",
        address: "Merveşehir, Mehmet Erdemoğlu Cd., 27590 Şehitkamil/Gaziantep",
      },
    ],
  },
};

export default config;
