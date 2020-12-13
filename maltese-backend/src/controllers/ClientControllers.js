const Client = require("../models/Client");
const Provider = require("../models/Provider");

module.exports = {
    async showProductsStore(req, res) {
        const { provider_id } = req.params;

        const provider = await Provider.findById(provider_id);

        const allProducts = provider.products;

        return res.status(200).json(allProducts);
    }
};
