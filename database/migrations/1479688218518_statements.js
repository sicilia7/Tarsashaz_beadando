'use strict'

const Schema = use('Schema')

class StatementsTableSchema extends Schema {

  up () {
    this.create('statements', (table) => {
      table.increments()
      table.string('title', 40).notNullable()
      table.text('text').notNullable()
      table.text('picture').notNullable()
      table.date('deadline').notNullable()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.timestamps()
    })
  }

  down () {
    this.drop('statements')
  }

}

module.exports = StatementsTableSchema
