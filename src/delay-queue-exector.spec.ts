#!/usr/bin/env ts-node

// tslint:disable:no-shadowed-variable
import * as test  from 'blue-tape'
import * as sinon from 'sinon'
// const sinonTest   = require('sinon-test')(sinon)

import DelayExector from './delay-queue-exector'

const DELAY_PERIOD_TIME = 10

const EXPECTED_VAL1 = 1
const EXPECTED_VAL2 = 2
const EXPECTED_VAL3 = 3

const MEANING_OF_LIFE = 42

test('DelayQueueExector execute once', async function (t) {
  const spy = sinon.spy()

  const delay = new DelayExector(DELAY_PERIOD_TIME)

  delay.execute(() => spy(EXPECTED_VAL1))

  t.ok(spy.calledOnce, 'should received 1 call immediately')
  t.equal(spy.firstCall.args[0], EXPECTED_VAL1, 'should get EXPECTED_VAL1')
})

test('DelayQueueExector execute thrice', async function (t) {
  const spy = sinon.spy()

  const delay = new DelayExector(DELAY_PERIOD_TIME)

  delay.execute(() => spy(EXPECTED_VAL1))
  delay.execute(() => spy(EXPECTED_VAL2))
  delay.execute(() => spy(EXPECTED_VAL3))

  t.ok(spy.calledOnce, 'should call once immediately')
  t.equal(spy.firstCall.args[0], EXPECTED_VAL1, 'should get EXPECTED_VAL1')

  await new Promise(r => setTimeout(r, DELAY_PERIOD_TIME + 3))
  t.ok(spy.calledTwice, 'should call twice after DELAY_PERIOD_TIME')
  t.equal(spy.secondCall.args[0], EXPECTED_VAL2, 'should get EXPECTED_VAL2')

  await new Promise(r => setTimeout(r, DELAY_PERIOD_TIME + 3))
  t.ok(spy.calledThrice, 'should call thrice after 2 x DELAY_PERIOD_TIME')
  t.equal(spy.thirdCall.args[0], EXPECTED_VAL3, 'should get EXPECTED_VAL3')

  await new Promise(r => setTimeout(r, DELAY_PERIOD_TIME + 3))
  t.ok(spy.calledThrice, 'should keep third call...')
})

test('DelayQueueExector return Promise', async t => {
  const delay = new DelayExector(0)

  const mol = await delay.execute(() => MEANING_OF_LIFE)
  t.equal(mol, MEANING_OF_LIFE, 'should get the function return value')

  const p = delay.execute(() => Promise.resolve(MEANING_OF_LIFE))
  t.ok(p instanceof Promise, 'should get the function return value(promise)')

  const value = await p
  t.equal(value, MEANING_OF_LIFE, 'should get the function return value by await')

})
