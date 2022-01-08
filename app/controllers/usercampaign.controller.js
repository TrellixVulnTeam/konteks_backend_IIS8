const db = require("../models");
const Campaign = db.campaign;
const User = db.user;
const Campaign_User = db.campaign_user;
const Op = db.Sequelize.Op;

// Create and Save a new Tutorial
exports.addCampaignUser = (req, res) => {
  // Validate request
  if (!req.body.campaign_id) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  if (!req.body.user_id) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  
  //find user
  User.findByPk(req.body.user_id)
  .then((user) => {
    if (!user) {
        res.status(400).send({
            message: "User Not Found"
        });
        return;
    }
    Campaign.findByPk(req.body.campaign_id).then((campaign) => {
      if (!campaign) {
        res.status(400).send({
            message: "Campaign Not Found"
        });
        return;
      }
      const campaign_user = {
        campaign_id: req.body.campaign_id,
        user_id: req.body.user_id
      };
      Campaign_User.create(campaign_user)
      .then(data => {
          res.send(data);
      }).catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Tutorial."
        });
      });
    });
  })
  .catch((err) => {
    console.log(">> Error while adding Compaign to News: ", err);
  });
};
// Retrieve all Campaign from the database.
exports.findAll = (req, res) => {
    const code = req.query.code;
    var condition = code ? { code: { [Op.like]: `%${code}%` } } : null;
 
    User.findAll({ 
       include: 
        [
            {
            model: Campaign,
            as: "usercampaign",
            attributes: ["id", "code"],
            through: {
                attributes: [],
                },
            },
        ],
       where: condition 
    })
   .then(data => {
     res.send(data);
   })
   .catch(err => {
     res.status(500).send({
       message:
         err.message || "Some error occurred while retrieving Campaigns."
     });
   });
};
exports.findOne = (req, res) => {
    const id = req.params.id;
    User.findByPk(
        id,{
            include: 
            [
                {
                model: Campaign,
                as: "usercampaign",
                attributes: ["id", "code"],
                through: {
                    attributes: [],
                    },
                },
            ]
        })
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find User with id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving User with id=" + id
        });
      });
};

