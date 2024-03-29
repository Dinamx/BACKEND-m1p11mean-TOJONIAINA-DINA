const mongoose = require('mongoose');
const { Utilisateur } = require("./utilisateur");
const { Preference } = require("./preferenceClient");
const { getPourcentageOffre } = require("./offrespeciale");

const ServiceSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    description: String,
    image: { type: String, default: '/assets/jolie.png' },
    prix: Number,
    duree: { type: Number, min: 0 },
    comission: { type: Number, min: 0, max: 100 }
});

const Service = mongoose.model('Service', ServiceSchema);


function getAllServices() {
    return Service.find({}).exec();
}

async function getCommission(idService) {
    try {
        const service = await Service.findById(idService).exec();
        if (!service) {
            throw new Error('Service non trouvé');
        }
        return service.comission;
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération de la commission du service: ', error);
        throw error;
    }
}

async function getCommissionService(idservice, prix_paye) {
    try {
        const commission = await getCommission(idservice);
        const result = (prix_paye * commission) / 100;
        console.log(result);
        return result;
    } catch (error) {
        console.error('Une erreur s\'est produite: ', error);
        throw error;
    }
}

async function getDuree(idservice) {
    try {
        const service = await Service.findById(idservice).exec();
        if (!service) {
            throw new Error('Service non trouvé');
        }
        return service.duree;
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération de la durree du service: ', error);
        throw error;
    }
}

async function getDescription(idService) {
    try {
        const service = await Service.findById(idService).exec();
        return service.description;
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération du service: ', error);
        throw error;
    }
}

async function getPrixService(idService) {
    try {
        const service = await Service.findById(idService).exec();
        return service.prix;
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération du service: ', error);
        throw error;
    }
}


async function getPrice(idclient, idservice) {
    try {
        const pourcentage = await getPourcentageOffre(idclient, idservice);
        const prixService = await getPrixService(idservice);
        const pourcentageOffre = (prixService * pourcentage) / 100;
        const pourcentageFinal = Math.max(pourcentageOffre, 0);
        const prixPaye = Number(prixService) - Number(pourcentageFinal);
        return prixPaye;

    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération de la commission du service: ', error);
        throw error;
    }
}


async function getServicePrefClient(idClient) {
    try {
        // Récupérer toutes les préférences du client
        const preferences = await Preference.find({ client: idClient }).exec();
        // Convertir les identifiants de service en chaînes de caractères
        const preferenceIds = preferences.map(pref => pref.service.toString());

        // Récupérer tous les services
        const services = await Service.find({}).exec();

        // Ajouter le champ 'favori' aux services
        const servicesWithFavori = services.map(service => {
            return {
                ...service._doc, // Copie toutes les propriétés du service
                favori: preferenceIds.includes(service._id.toString()) ? 1 : 0 // Convertir service._id en chaîne de caractères avant la comparaison
            };
        });

        return servicesWithFavori;
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération des services avec le champ favori: ', error);
        throw error;
    }
}


module.exports = { Service, getAllServices, getCommissionService, getDuree, getCommission, getDescription, getPrice, getServicePrefClient };
