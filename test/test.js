const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../index')
const should = chai.should()
const expect = chai.expect

chai.use(chaiHttp)

// ---> DEBUT
/**
  * Génération des nouvelles couleurs et enregistrement de ces
  * couleurs dans un tableau.
  */
const newValues = []
const colorKey = 'NEW_COLOR_'
let nextCursor = 0;
const payloadColor = () => {
  const nextColor = `${colorKey}${nextCursor}`
  newValues.push(nextColor)
  nextCursor++;
  return { 'color': nextColor }
}
const getCurrentColor = () => {
  return nextCursor > 0 ? `${colorKey}${nextCursor - 1}` : `${colorKey}O`
}
// <-- FIN

describe('GET /colors', () => {
  it('should return all colors', (done) => {
    chai.request(app)
      .get('/colors')
      .end((error, response) => {
        if(error) {
          console.log(error)
        } else {
          expect(response).to.have.status(200)
          expect(response).to.be.json;
          expect(response.body).to.be.an('object')
          expect(response.body.results).to.be.an('array')
          expect(response.body.results).to.eql(['RED', 'GREEN', 'BLUE'])
          done()
        }
      })
  })
})

describe('GET /invalid', () => {
  it('should return Bad Request', (done) => {
    chai.request(app)
      .get('/invalid') .end((error, response) => {
        if(error) {
          console.log(error)
        } else {
          expect(response).to.have.status(404)
          done()
        }
      })
  })  
})

describe('POST /colors', () => {
  it('should add new color', (done) => {
    chai.request(app)
      .post('/colors') .send(payloadColor()) .end((error, response) => {
        if(error) {
          console.log(error)
        } else {
          expect(response).to.have.status(201)
          expect(response).to.be.json
          expect(response.body).to.be.an('object')
          expect(response.body.results).to.be.an('array')
          expect(response.body.results).to.include(getCurrentColor())
          console.log(getCurrentColor())
          done()
        }
      })
  })
})

describe('GET /colors', () => {
  it('should return new color list Request', (done) => {
    chai.request(app)
      .get('/colors') .end((error, response) => {
        if(error) {
          console.log(error)
        } else {
          expect(response).to.have.status(200)
          expect(response).to.be.json;
          expect(response.body).to.be.an('object')
          expect(response.body.results).to.be.an('array')
          expect(response.body.results).to.eql(['RED', 'GREEN', 'BLUE', getCurrentColor()])
          done()
        }
      })
  })
})