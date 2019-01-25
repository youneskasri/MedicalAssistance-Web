const { SELECT_MEDICAMENTS_CNOPS,
    SELECT_PRESCRIPTION, INSERT_MEDICAMENT } = require("./queries");

exports.indexMedicaments = (req, res, next) => {
    const { connection } = req;
    connection.query(SELECT_MEDICAMENTS_CNOPS, [],  function(err, results){
        if (err) return next(err);
        const medicaments =  filtrerMedicaments(results, req.query );
        res.render("medicaments", { medicaments, ...req.query });
    });
}

function filtrerMedicaments(medicaments, params) {
    if (!params) return;    
    const columns = Object.keys(params);

    console.log("COLUMNS", columns);

    return medicaments.filter( medicament => {
        for (let i =0; i<columns.length; i++){
            let A = ""+medicament[columns[i]];
            let B = ""+params[columns[i]];
            console.log(A, " includes ", B, " ??");            
            if (A.includes(B) === false) {
                return false;
            }             
        }
        return true;
    });
}

exports.prescrireMedicament = (req, res, next) => {
    const { connection } = req;
    const idPatient = req.params.id;
    const idMedecin = 3; // TODO session

    connection.query(SELECT_PRESCRIPTION, [idMedecin, idPatient], function(err, results){
        const { idPrescription } = results[0];
        const { nom, indications } = req.body;

        const params = [ nom, indications, idPrescription];
        connection.query(INSERT_MEDICAMENT, params, function(err){
            if (err) return next(err);
            res.redirect("/patients/"+idPatient);
        }); 
    });       
}