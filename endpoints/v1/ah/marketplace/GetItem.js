module.exports = {
  path: "",
  method: "GET",
  Auth: true,
  run: async (req, res, mongo_client) => {
    try {
      const collection = mongo_client.db("ArcadeHaven").collection("items");

      // Only allow filtering by itemId, for example
      const allowedFilters = {};
      if (req.query.itemId) {
        const id = parseInt(req.query.itemId, 10);
        if (!isNaN(id)) {
          allowedFilters.itemId = id;
        }
      }

      // Aggregate pipeline with single project stage (excluding serials.h)
      const items = await collection.aggregate([
        { $match: allowedFilters },
        {
          $project: {
            _id: 0,
            serials: {
              h: 0,
              // If you want to include other serial fields, leave as is
            },
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
      ]).toArray();

      res.status(200).json({
        status: "success",
        data: items,
      });
    } catch (err) {
      console.error("🔥 API error in GetItem.js:", err);
      return res.status(500).json({
        status: "error",
        error: "Internal server error",
      });
    }
  },
};
