const models = require('../../models');

const index = (req, res) => {
  console.log('index');

  req.query.limit = req.query.limit || 10;
  const limit = parseInt(req.query.limit, 10);
  if (Number.isNaN(limit)) {
    return res.status(400).end();
  }

  models.Poem
    .findAll({
      limit: limit
    })
    .then(poems => {
      res.json(poems);
    });
};

const today = (req, res) => {
  const Op = models.Sequelize.Op;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tommrrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  console.log('오늘: ' + today);
  console.log('내일: ' + tommrrow);

  models.Poem.findAll({
    where: {
      reservationDate: {
        [Op.gte]: today,
        [Op.lt]: tommrrow
      }
    }
  }).then(poem => {
    if (poem.length == 0) return res.status(404).end();

    console.log('검색된 시: ' + poem[0]['title'])
    console.log('검색된 시 시간: ' + poem[0]['reservationDate'])

    res.json(poem[0]);
  });
};

const show = (req, res) => {
  console.log('show');

  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).end();

  models.User.findOne({
    where: {
      id: id
    }
  }).then(user => {
    if (!user) return res.status(404).end();
    res.json(user);
  });
};

const destroy = (req, res) => {
  console.log('destroy');

  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).end();

  models.User.destroy({
    where: {id}
  }).then(() => {
    res.status(204).end();
  });
};

const create = (req, res) => {
  console.log('create');

  const title = req.body.title;
  const contents = req.body.contents;
  const reservationDate = req.body.reservationDate;

  if (!title || !contents || !reservationDate) return res.status(400).end();

  models.Poem.create({title, contents, reservationDate})
    .then(poem => {
      res.status(201).json(poem);
    }).catch( err => {
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).end();
      }
      res.status(500).end();
    });
};

const update = (req, res) => {
  console.log('update');

  const id = parseInt(req.params.id);
  if (Number.isNaN(id)) return res.status(400).end();

  const name = req.body.name;
  if (!name) return res.status(400).end();

  models.User.findOne({where: {id}})
    .then(user => {
      if (!user) return res.status(404).end();

      user.name = name;
      user.save()
          .then( _ => {
            res.json(user);
          })
          .catch( err => {
            if (err.name === 'SequelizeUniqueConstraintError') {
              return res.status(409).end();
            }
        });
    });
  };

module.exports = {
  index,
  show,
  destroy,
  create,
  update,
  today
};