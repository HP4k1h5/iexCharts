module.exports = {
  loginUser: loginUser,
  createUser: createUser
}

function loginUser(email, password, cnx, res){
  let checkUserPass = `SELECT * from users WHERE email = "${email}" and password = "${password}";` 
  cnx.query(checkUserPass, function(err, pass_result){
    if (err) throw err
    if (pass_result.length === 1){
      console.log('1', pass_result )
      let histQuery = `SELECT * from user_profiles where uniq_id = ${pass_result[0].uniq_id}`
      cnx.query(histQuery, function(err, hist_result){
        if (err) throw err
        res.end(hist_result[0].quote_history)
      })
    }
    else{
      console.log('not one', result)
    }
  })
}

function createUser(login_id, email, password, cnx){
  let searchUsers = `SELECT login_id, email from users WHERE email = "${email}";` 
  cnx.query(searchUsers, function(err, searchResult){
    if (err){
      throw err
    }
    if (searchResult.length === 0){
      console.log('0', searchResult)
      let addUser = `INSERT into users VALUES (null, "${login_id}", "${email}", "${password}")`
      cnx.query(addUser, (err, addResult) => {
        if (err) throw err
        let uniq_id = addResult[0].uniq_id
        let addUserProfile = `INSERT into user_profiles VALUES (${uniq_id}, '{}', '{}')`
      })
    }
    else{
      console.log('email exists', searchResult)
    }
  })
}
