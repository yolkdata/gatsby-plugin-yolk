module.exports = {
  plugins: [
    {
        resolve: `gatsby-plugin-yolk`,
        options: {
            apiKey: YOUR_API_KEY, // *required
            org: "yolk", // *required // your organization name as set in Yolk.
            option: false,
        },
    },
  ],
}

// require.resolve(`../my-plugin`),