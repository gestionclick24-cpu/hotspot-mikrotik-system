const db = require('../db');

async function listPlans(){
  return db('plans').select('*').orderBy('id');
}
async function getPlan(id){
  return db('plans').where({ id }).first();
}
async function createPlan(data){
  return db('plans').insert(data).returning('*');
}
async function updatePlan(id, data){
  return db('plans').where({ id }).update(data).returning('*');
}
async function deletePlan(id){
  return db('plans').where({ id }).del();
}

module.exports = { listPlans, getPlan, createPlan, updatePlan, deletePlan };
