process.env.NODE_ENV = 'test';
const app = require('../../app');
const { describe, it } = require('mocha');
const chai = require('chai');
const expect = require('chai').expect;
const chaiHttp = require('chai-http');
const User = require('../../models/user');
let userJwt = '';

chai.use(chaiHttp);

describe('User sing up', () => {
    beforeEach(done => {
        User.deleteMany({}, err => {
            if (err) console.log(err);
            done();
        });
    });

    it('should return 200 for proper sing up data', done => {
        chai.request(app).post('/user/register')
            .send({
                username: "Bartosz Kochanowski",
                name: "Bartosz",
                surname: "Kowalski",
                password: "Haslo123!",
                email: "bkochan@mail.com",
                gender: "male",
                birthdate: "1998-10-10",
                city: "Katowice",
                bio: "Pasjonat ogrodnictwa"
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.message).to.be.equal('User created successfully');
                User.findOne({ username: 'Bartosz Kochanowski' })
                    .then(result => {
                        result.active = true;
                        result.save();
                        done();
                    })
                    .catch(err => {
                        done(err);
                    });
            });
    });
});

describe('User sign in', () => {
    it('should return 200 and token for valid credentials', done => {
        chai.request(app).post('/user/signin')
            .send({
                email: 'bkochan@mail.com',
                password: 'Haslo123!'
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.jwt).to.exist;
                expect(res.body.message).to.be.equal('User has been logged in');
                userJwt = res.body.jwt;
                done();
            });
    });
    it('should return 401 invalid credentials', done => {
        chai.request(app).post('/user/signin')
            .send({
                email: 'bkocha@mail.com',
                password: 'Haslo123!'
            })
            .end((err, res) => {
                expect(res).to.have.status(401);
                done();
            });
    });
});

describe('User profile', () => {
    it('when user is logged he should be able to view his profile', done => {
        chai.request(app).get('/user/profile')
            .set({
                Authorization: `JWT ${userJwt}`
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.message).to.exist;
                done();
            });
    });
});

describe('User search', () => {
    it('user should be displayed when searched for', done => {
        chai.request(app).get('/user/search?phrase=Katowice')
            .set({
                Authorization: `JWT ${userJwt}`
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.result).to.have.lengthOf(1);
                done();
            });
    });
});

describe('User profile update', () => {
    it('user profile should be modified', done => {
        chai.request(app).put('/user/update')
            .set({
                Authorization: `JWT ${userJwt}`
            })
            .send({
                country: 'Germany'
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.message).to.be.equal('Your profile has been updated');
                done();
            });
    });
});
