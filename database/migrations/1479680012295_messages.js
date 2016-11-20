'use strict'

const Schema = use('Schema')

class MessagesTableSchema extends Schema {

  up () {
    this.create('messages', (table) => {
      table.increments()
      table.string('title', 40).notNullable()
      table.text('text').notNullable()
      table.text('picture').notNullable()
      table.integer('status')
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.timestamps()
    })
  }

  down () {
    this.drop('messages')
  }

}

module.exports = MessagesTableSchema
