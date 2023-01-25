import requests
import json
import string
import random

host='http://localhost:3080'

endpoint=host + ''

jsonHeader = {"Content-Type": "application/json"}

def randomString(nbLetters, authorized):
    return ''.join([random.choice(authorized) for i in range(nbLetters)])



def headerWithJWT(jwt):
    ret = jsonHeader
    ret.update({'authorization' : jwt})
    return ret

pseudoTest = randomString(8, string.ascii_letters)
passwordTest = randomString(8, string.ascii_letters)

def register(pseudo, password):
    url = endpoint + '/auth/register'
    res = requests.post(url, json={'pseudo':pseudo, 'password':password}, headers=jsonHeader)
    print(url)
    print(res.content)
    assert res.status_code == 201
    return res.json()['jwt']

def login(pseudo, password):
    url = endpoint + '/auth/login'
    res = requests.post(url, json={'pseudo':pseudo, 'password':password}, headers=jsonHeader)
    print(url)
    print(res.content)
    assert res.status_code == 200
    return res.json()['jwt']

def delete(jwt, password):
    url = endpoint + '/auth/delete'
    res = requests.delete(url, json={'password':password}, headers=headerWithJWT(jwt))
    print(url)
    print(res.content)
    assert res.status_code == 200

def test_ping():
    res = requests.get(host)
    print(host)
    print(res.content)
    assert res.status_code == 200

def test_register():
    jwt = register(pseudoTest, passwordTest)
    delete(jwt, passwordTest)

def test_login():
    register(pseudoTest, passwordTest)
    jwt = login(pseudoTest, passwordTest)
    delete(jwt, passwordTest)

def test_faillogin_password():
    jwt = register(pseudoTest, passwordTest)
    url = endpoint + '/auth/login'
    res = requests.post(url, json={'pseudo' : pseudoTest, 'password':'badPassword'},headers=jsonHeader)
    print(url)
    print(res.content)
    assert res.status_code == 401
    delete(jwt, passwordTest)

def test_faillogin_pseudo():
    jwt = register(pseudoTest, passwordTest)
    url = endpoint + '/auth/login'
    res = requests.post(url, json={'pseudo' : 'badPseudo', 'password':'badPassword'},headers=jsonHeader)
    print(url)
    print(res.content)
    assert res.status_code == 401
    delete(jwt, passwordTest)



