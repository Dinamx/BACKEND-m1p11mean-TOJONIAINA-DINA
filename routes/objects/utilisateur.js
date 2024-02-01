const mongoose = require('mongoose');

const UtilisateurSchema = new mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    email: String,
    password: String,
    type_user: { type: String, enum: ['client', 'manager', 'employe'] }
});

const Utilisateur = mongoose.model('Utilisateur', UtilisateurSchema);


function getAllUsers() {
    return Utilisateur.find({}).exec();
}

//Client Manager Employe

async function getUser(email, password) {
    try {
        const user = await Utilisateur.findOne({ email, password, type_user: 'admin' }).exec();

        if (!user) {
            throw new Error('Utilisateur admin non trouvé');
        }

        return user;
    } catch (error) {
        throw new Error('Erreur lors de la recherche de l\'utilisateur admin');
    }
}



// Amena email sy password dia mamerina oe inona le type (Client, na manager na employe no type)
function getTypeUser(){

}




module.exports = Utilisateur;
module.exports = { Utilisateur, getAllUsers };