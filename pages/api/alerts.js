// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const baseDate = Date.parse("2019-06-01");
const calvingRate = 2.25 * 60 * 60 * 1000; //seconds in 2:15 hours

function calvings(now) {
  return Math.floor((now - baseDate) / calvingRate)
}

function dummyData(calvings) {
    return {
      perfect: Math.floor(calvings * 0.85),
      eventual: Math.floor(calvings * 0.12),
      false_: Math.floor(calvings * 0.02),
      missed: Math.floor(calvings * 0.01)
    }
}

export default (req, res) => {
  res
    .status(200)
    .json(dummyData(calvings(Date.now() + 604800000)));
}
