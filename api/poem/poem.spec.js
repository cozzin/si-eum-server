const request = require('supertest');
const should = require('should');
const app = require('../../index');
const models = require('../../models');

describe('GET /poem은', ()=> {
  const poems = [
  {
    title: '첫 번째 시 제목',
    contents: '첫 번째 시 내용\n뭔가 다양한 글들이 있을 것이다.',
    reservationDate: Date.UTC(2018, 4, 1)
  },
  {
    title: '두 번째 시 제목',
    contents: '첫 번째 시 내용\n뭔가 다양한 글들이 있을 것이다.',
    reservationDate: Date.UTC(2018, 4, 2)
  }, 
  {
    title: '세 번째 시 제목',
    contents: '첫 번째 시 내용\n뭔가 다양한 글들이 있을 것이다.',
    reservationDate: Date.UTC(2018, 4, 3)
  }]
  before(() => models.sequelize.sync({force: true}));
  before(() => models.Poem.bulkCreate(poems));

  describe('성공시', ()=> {
    it('poem 객체를 담은 배열로 응답한다', (done) => {
      request(app)
        .get('/poem')
        .end((err, res) => {
          res.body.should.be.instanceOf(Array)
          done();
        });
    });
    it('최대 limit 갯수만큼 응답한다', (done) => {
      request(app)
      .get('/poem?limit=2')
      .end((err, res) => {
        res.body.should.have.lengthOf(2)
        done();
      });
    });
  });

  describe('실패시', ()=> {
    it('limit이 숫자형이 아니면 400을 응답한다', (done) => {
      request(app)
        .get('/poem?limit=two')
        .expect(400)
        .end(done);
    })
  })
});

describe('GET /users/2은', () => {
  const users = [{name: 'alice'}, {name: 'bek'}, {name: 'chris'}]
  before(() => models.sequelize.sync({force: true}));
  before(() => models.User.bulkCreate(users));

  describe('성공시', () => {
    it('id가 1인 유저 객체를 반환한다', (done) => {
      request(app)
        .get('/users/2')
        .end((err, res) => {
          res.body.should.have.property('id', 2);
          done();
        });
    });
  });

  describe('실패시', () => {
    it('id가 숫자가 아닐 경우 400으로 응답한다', (done) => {
      request(app)
        .get('/users/one')
        .expect(400)
        .end(done)
    });
    it('id로 유저를 찾을 수 없는 경우 404로 응답한다', (done) => {
      request(app)
        .get('/users/999')
        .expect(404)
        .end(done);
    });
  })
});

describe('DELETE /users/:id는', () => {
  const users = [{name: 'alice'}, {name: 'bek'}, {name: 'chris'}]
  before(() => models.sequelize.sync({force: true}));
  before(() => models.User.bulkCreate(users));

  describe('성공시', () => {
    it('204를 응답한다', (done) => {
      request(app)
        .delete('/users/2')
        .expect(204)
        .end(done);
    });
  });
  
  describe('실패시', () => {
    it('id가 숫자가 아닐 경우 400으로 응답한다', done => {
      request(app)
        .delete('/users/one')
        .expect(400)
        .end(done);
    });
  })
});

describe.only('POST /users', () => {
  const poems = [
    {
      title: '첫 번째 시 제목',
      contents: '첫 번째 시 내용\n뭔가 다양한 글들이 있을 것이다.',
      reservationDate: Date.UTC(2018, 4, 1)
    },
    {
      title: '두 번째 시 제목',
      contents: '첫 번째 시 내용\n뭔가 다양한 글들이 있을 것이다.',
      reservationDate: Date.UTC(2018, 4, 2)
    }, 
    {
      title: '세 번째 시 제목',
      contents: '첫 번째 시 내용\n뭔가 다양한 글들이 있을 것이다.',
      reservationDate: Date.UTC(2018, 4, 3)
    }
  ]
  before(() => models.sequelize.sync({force: true}));
  before(() => models.User.bulkCreate(poems));

  describe('성공시', () => {
    let title = '새로운 시 제목',
        contents = '새로운 시 내용\n뭔가 다양한 글들이 있을 것이다.',
        reservationDate = Date.UTC(2018,4,1),
        body;

    before(done => {
      request(app)
        .post('/poem')
        .send(
          {
            title, 
            contents, 
            reservationDate
          })
        .expect(201)
        .end((err, res) => {
          body = res.body;
          done();
        });
    })
    it('입력한 title를 반환한다', () => {
      body.should.have.property('title', title);
    })
    it('입력한 contents를 반환한다', () => {
      body.should.have.property('contents', contents);
    });
    it('입력한 reservationDate를 반환한다', () => {
      body.should.have.property('reservationDate');
    });
  });

  describe('실패시', () => {
    it('name 파라미터 누락시 400을 반환한다', (done) => {
      request(app)
        .post('/poem')
        .send({
          title: '첫 번째 시 제목'
        })
        .expect(400)
        .end(done);
    });
  });
});

describe('PUT /users/:id', () => {
  const users = [{name: 'alice'}, {name: 'bek'}, {name: 'chris'}]
  before(() => models.sequelize.sync({force: true}));
  before(() => models.User.bulkCreate(users));

  describe('성공시', () => {
    it('변경된 name을 응답한다', (done) => {
      const name = 'charlly';
      request(app)
        .put('/users/3')
        .send({name})
        .end((err, res) => {
          res.body.should.have.property('name', name);
          done();
        });
    });
  });
  describe('실패시', () => { 
    it('정수가 아닌 id일 경우 400을 응답한다', (done) => {
      request(app)
        .put('/users/one')
        .expect(400)
        .end(done);
    });
    it('name이 없을 경우 400을 응답한다', (done) => {
      request(app)
        .put('/users/1')
        .send({})
        .expect(400)
        .end(done);
    });
    it('없는 유저일 경우 404로 응답한다', (done) => {
      request(app)
        .put('/users/999')
        .send({name: 'foo'})
        .expect(404)
        .end(done);
    });
    it('이름이 중복일 경우 409를 응답한다', (done) => {
      request(app)
        .put('/users/3')
        .send({name: 'bek'})
        .expect(409)
        .end(done);
    });
  })
});