const pool = require('../helpers/db').pool;
const nodemailer = require('nodemailer');

module.exports = {
    addSubscription(req, res){

        const data = {
            //? Use bearer token to get the user_id
            user_id: req.body.user_id,
            manga_id: req.params.id,
        }
    
            // Para que funcione el envio de email con gmail, hay que permitir el acceso de aplicaciones no seguras
            // O volver tu aplicacion segura 
            //! Recordar desactivar dicha opcion despues de la prueba pues pueden joderte 
        
            let transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: 'rafajrg21@gmail.com',
                pass: '216950rr'
              }
            });
            
            var mailOptions = {
              from: 'rafajrg21@gmail.com',
              to: 'francissanchezdl51@gmail.com',
              subject: 'Subscription to manga Reader!',
              text: `Te subscribiste a un manga!
              A partir de ahora, seras notificado cada vez que un nuevo capitulo de ${data.manga_id} sea subido!`
            };

        pool.connect((err, client, next) => {
            //! Prevent the user to make multiple subscription
            const query = 'INSERT INTO subscribe(user_id, manga_id) VALUES ($1,$2) RETURNING *';
            const values = [data.user_id, data.manga_id];
    
            client.query(query, values, (error, result) => {
                if(error){
                    res.status(400).json({error});
                }

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                      res.status(200).send({
                        status: 'Successful',
                        message: 'Subscription done!',
                        subscription: result.rows,
                        });
                    }
                  }); 
            });
        });
    },
}