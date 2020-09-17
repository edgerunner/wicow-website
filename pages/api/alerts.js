// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const dummyData = {
    perfect: 1812,
    eventual: 23,
    false_: 5,
    missed: 2,
    latest: { name: "Sarıkız", country: "TR", time: Date.now() - 86400000 }
}

export default (req, res) => {
  res
    .status(200)
    .json(dummyData);
}
