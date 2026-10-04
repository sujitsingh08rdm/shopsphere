module.exports = {
  siteUrl: process.env.SERVER,
  generateRobotTxt: true,
  exclude: ["/admin*", "/user/*"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin*", "/user/*"],
      },
    ],
  },
};
