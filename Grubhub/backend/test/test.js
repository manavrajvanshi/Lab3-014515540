var chai = require('chai'), chaiHttp = require('chai-http');

chai.use(chaiHttp);

var expect = chai.expect;

it("Should check Buyer credentials and login", function(done){
    chai.request('http://localhost:3001')
    .post('/buyer/signin')
    .send({ "email": "manavraj96@gmail.com", "password" : "a"})
    .end(function (err, res) {
        console.log("res",res);
        expect(res).to.have.status(200);
        expect(res).to.have.cookie('authCookieb');
        done();
    });
})

it("Should check Owner credentials and login", function(done){
    chai.request('http://localhost:3001')
    .post('/restaurant/signin')
    .send({ "email": "o1@1.com", "password" : "a"})
    .end(function (err, res) {
        console.log("res",res);
        expect(res).to.have.status(200);
        expect(res).to.have.cookie('authCookieo');
        done();
    });
})

it("Should fetch Buyer Homepage and return status code", function(done){
    chai.request('http://localhost:3001')
    .post('/buyer/home')
    .send({ "bid":1})
    .end(function (err, res) {
        console.log("res",res);
        expect(res).to.have.status(200);
        done();
    });
})

it("Should fetch Owner Homepage and return status code", function(done){
    chai.request('http://localhost:3001')
    .post('/restaurant/home')
    .send({ "rid": 1})
    .end(function (err, res) {
        console.log("res",res);
        expect(res).to.have.status(200);
        done();
    });
})

it("Should fetch restaurants serving Omelette", function(done){
    chai.request('http://localhost:3001')
    .post('/buyer/searchItem')
    .send({ "searchItem": "Omelette"})
    .end(function (err, res) {
        console.log("res",res);
        expect(res).to.have.status(200);
        done();
    });
})

