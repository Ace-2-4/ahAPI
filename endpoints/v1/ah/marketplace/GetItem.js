module.exports = {
  path: "",
  method: "GET",
  Auth: true,
  run: async (req, res, mongo_client) => {
    try {
      const collection = mongo_client.db("ArcadeHaven").collection("items");
      let filter = req.query;

      if (filter.itemId) {
        filter.itemId = parseInt(filter.itemId);
      }

      const items = await collection.aggregate([
        { $match: filter },
        {
          $project: {
            _id: 0,
            serials: 1,
            itemId: 1,
            name: 1,
            creator: 1,
            description: 1,
            type: 1,
            originalPrice: 1,
            releaseTime: 1,
            rap: 1,
            quantitySold: 1,
            history: 1,
            reselling: 1,
            tradeable: 1,
            offsaleTime: 1,
            value: 1,
            projected: 1,
            totalQuantity: 1,
          },
        },
        {
          $project: {
            "serials.h": 0,
          },
        },
      ]).toArray();

      res.status(200).json({
        status: "success",
        data: items,
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "error",
        error: "Internal server error",
      });
    }
  },
};
