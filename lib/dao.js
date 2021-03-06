const { Pool, Client } = require('pg')

const databaseUrl = process.env.DATABASE_URL || 'postgres://postgres:mysecretpassword@localhost:5432/postgres';

const pool = new Pool({
	connectionString: databaseUrl,
});

var dao = {

    getUserProfile:async function(teamId, callback) {
        const client = await pool.connect()
		await client.query('BEGIN')
        client.query('SELECT tu.team_id AS team_id, tu.user_id AS user_id, u.firstname AS firstname, u.lastname AS lastname, u.weapon AS weapon, u.pseudo AS pseudo FROM team_users tu INNER JOIN users u ON (tu.user_id = u.id) WHERE team_id = $1', [teamId], function(err, result){
            if(err){console.log(err);}
            else {
                client.release();
                callback(err, result);
            }
        });
    },

    getUserId:async function(email, callback) {
        const client = await pool.connect()
        await client.query('BEGIN')
        client.query('SELECT id FROM "users" WHERE "email"=$1', [email], function(err, result) {
            if(err){console.log(err);}
            else {
                client.release();
                callback(err, result);
            }
        });
    },

    createUser:async function(id, firstname, lastname, email, password, callback) {
        const client = await pool.connect()
        await client.query('BEGIN')
        client.query('INSERT INTO users (id, "firstname", "lastname", email, password) VALUES ($1, $2, $3, $4, $5)', [id, firstname, lastname, email, password], function(err, result) {
            if(err){console.log(err);}
            else {
			    client.query('COMMIT')
                client.release();
                callback(err, result);
            }
        });
    },

    countTeamUsers:async function(teamId, callback) {
        const client = await pool.connect()
        await client.query('BEGIN')
        client.query('SELECT COUNT(*) AS count FROM team_users WHERE team_id = $1', [teamId], function(err, result) {
            if(err){console.log(err);}
            else {
                client.release();
                callback(err, result);
            }
        });
    },

    getTeamCode:async function(code, callback) {
        const client = await pool.connect()
        await client.query('BEGIN')
        client.query('SELECT * FROM team_codes WHERE code = $1', [code], function(err, result) {
            if(err){console.log(err);}
            else {
                client.release();
                callback(err, result);
            }
        });
    },

    countTeamUsersAndGetOffer:async function(teamId, callback) {
        const client = await pool.connect()
        await client.query('BEGIN')
        client.query('SELECT t.id, COUNT(tu.*) AS count, t.offer AS offer FROM team_users tu INNER JOIN team t ON t.id = tu.team_id WHERE team_id = $1 GROUP BY t.id, t.offer', [teamId], function(err, result) {
            if(err){console.log(err);}
            else {
                client.release();
                callback(err, result);
            }
        });
    },

    getUser:async function(email, callback) {
        const client = await pool.connect()
        await client.query('BEGIN')
        client.query('SELECT * FROM users WHERE email=$1', [email], function(err, result) {
            if(err){console.log(err);}
            else {
                client.release();
                callback(err, result);
            }
        });
    },

    useCode:async function(code, callback) {
        const client = await pool.connect()
        await client.query('BEGIN')
        client.query('UPDATE team_codes SET is_used = TRUE WHERE code = $1', [code], function(err, result) {
            if(err){console.log(err);}
            else {
                client.query('COMMIT')
                client.release();
                callback(err, result);
            }
        });
    },

    createTeamUsers:async function(teamId, userId, callback) {
        const client = await pool.connect()
        await client.query('BEGIN')
        client.query('INSERT INTO team_users (team_id, user_id) VALUES ($1, $2)', [teamId, userId], function(err, result) {
            if(err){console.log(err);}
            else {
                client.query('COMMIT')
                client.release();
                callback(err, result);
            }
        });
    },

    getTeam:async function(teamId, callback) {
        const client = await pool.connect()
        await client.query('BEGIN')
        client.query('SELECT * FROM team WHERE id = $1', [teamId], function(err, result) {
            if(err){console.log(err);}
            else {
                client.release();
                callback(err, result);
            }
        });
    },

    getCoachEmail:async function(teamId, callback) {
        const client = await pool.connect()
        await client.query('BEGIN')
        client.query('SELECT email FROM users WHERE id = (SELECT coach_id FROM team WHERE id = $1)', [teamId], function(err, result) {
            if(err){console.log(err);}
            else {
                client.release();
                callback(err, result);
            }
        });
    },

    leaveTeam:async function(userId, callback) {
        const client = await pool.connect()
        await client.query('BEGIN')
        client.query('DELETE FROM "team_users" WHERE "user_id"=$1', [userId], function(err, result) {
            if(err){console.log(err);}
            else {
                client.query('COMMIT')
                client.release();
                callback(err, result);
            }
        });
    },

    getTeamId:async function(teamName, callback) {
        const client = await pool.connect()
        await client.query('BEGIN')
        client.query('SELECT id FROM "team" WHERE "name"=$1', [teamName], function(err, result) {
            if(err){console.log(err);}
            else {
                client.release();
                callback(err, result);
            }
        });
    },

    getTeamUser:async function(userId, callback) {
        const client = await pool.connect()
        await client.query('BEGIN')
        client.query('SELECT * FROM team_users WHERE user_id=$1', [userId], function(err, result) {
            if(err){console.log(err);}
            else {
                client.release();
                callback(err, result);
            }
        });
    },

    getAccountDataWithTeam:async function(email, callback) {
        const client = await pool.connect()
        await client.query('BEGIN')
        client.query('SELECT u.id as id, u.firstname as firstname, u.lastname as lastname, u.email as email, u.password as password, u.birthday as birthday, u.iam as iam, u.pseudo as pseudo, u.city as city, u.weapon as weapon, t.id as team_id, t.coach_id as team_coach_id, t.name as team_name, t.offer as team_offer FROM (users u INNER JOIN team_users tu ON (u.id = tu.user_id)) INNER JOIN team t ON (tu.team_id = t.id) WHERE u.email=$1', [email], function(err, result) {
            if(err){console.log(err);}
            else {
                client.release();
                callback(err, result);
            }
        });
    },

    getAccountDataWithoutTeam:async function(email, callback) {
        const client = await pool.connect()
        await client.query('BEGIN')
        client.query('SELECT id, firstname, lastname, email, password, birthday, iam, pseudo, city, weapon FROM users WHERE email=$1', [email], function(err, result) {
            if(err){console.log(err);}
            else {
                client.release();
                callback(err, result);
            }
        });
    },

    getTeamIdFromCodes:async function(code, callback) {
        const client = await pool.connect()
        await client.query('BEGIN')
        client.query('SELECT team_id FROM team_codes WHERE code = $1', [code], function(err, result) {
            if(err){console.log(err);}
            else {
                client.release();
                callback(err, result);
            }
        });
    },

    createCode:async function(teamId, code, callback) {
        const client = await pool.connect()
        await client.query('BEGIN')
        client.query('INSERT INTO team_codes (team_id, code) VALUES ($1, $2)', [teamId, code], function(err, result) {
            if(err){console.log(err);}
            else {
                client.query('COMMIT')
                client.release();
                callback(err, result);
            }
        });
    },

    checkUserInTeam:async function(coachId, userId, callback) {
        const client = await pool.connect()
        await client.query('BEGIN')
        client.query('SELECT * FROM team_users WHERE team_id = (SELECT id FROM team WHERE coach_id = $1) AND user_id = $2', [coachId, userId], function(err, result) {
            if(err){console.log(err);}
            else {
                client.release();
                callback(err, result);
            }
        });
    },

    kickUser:async function(userId, callback) {
        const client = await pool.connect()
        await client.query('BEGIN')
        client.query('DELETE FROM team_users WHERE user_id = $1', [userId], function(err, result) {
            if(err){console.log(err);}
            else {
                client.query('COMMIT')
                client.release();
                callback(err, result);
            }
        });
    },

    dropTeamInTeamUsers:async function(teamId, callback) {
        const client = await pool.connect()
        await client.query('BEGIN')
        client.query('DELETE FROM "team_users" WHERE "team_id"=$1', [teamId], function(err, result) {
            if(err){console.log(err);}
            else {
                client.query('COMMIT')
                client.release();
                callback(err, result);
            }
        });
    },

    dropTeam:async function(teamId, callback) {
        const client = await pool.connect()
        await client.query('BEGIN')
        client.query('DELETE FROM "team" WHERE "id"=$1', [teamId], function(err, result) {
            if(err){console.log(err);}
            else {
                client.query('COMMIT')
                client.release();
                callback(err, result);
            }
        })
    },

    updatePrivateInfos:async function(email, firstname, lastname, newEmail, birthday, callback) {
        const client = await pool.connect()
        await client.query('BEGIN')
        client.query('UPDATE users SET firstname=$2, lastname=$3, email=$4, birthday=$5 WHERE email=$1', [email, firstname, lastname, newEmail, birthday], function(err, result) {
            if(err){console.log(err);}
            else {
                client.query('COMMIT')
                client.release();
                callback(err, result);
            }
        });
    },

    updatePublicInfos:async function(email, iam, pseudo, city, weapon, callback) {
        const client = await pool.connect()
        await client.query('BEGIN')
        client.query('UPDATE users SET iam=$2, pseudo=$3, city=$4, weapon=$5 WHERE email=$1', [email, iam, pseudo, city, weapon], function(err, result) {
            if(err){console.log(err);}
            else {
                client.query('COMMIT')
                client.release();
                callback(err, result);
            }
        });
    },

    createTeam:async function(team_id, coach_id, name, offer, callback) {
        const client = await pool.connect()
        await client.query('BEGIN')
        client.query('INSERT INTO team (id, coach_id, name, offer) VALUES ($1, $2, $3, $4)', [team_id, coach_id, name, offer], function(err, result) {
            if(err){console.log(err);}
            else {
                client.query('COMMIT')
                client.release();
                dao.createTeamUsers(team_id, coach_id, callback);
            }
        });
    },

    getEventTypes:async function(callback) {
        const client = await pool.connect()
        await client.query('BEGIN')
        client.query('SELECT * FROM event_types', [], function(err, result) {
            if(err){console.log(err);}
            else {
                client.release();
                callback(err, result);
            }
        });
    },

    createEvent:async function(event_id, team_id, date, description, event_type, callback) {
        const client = await pool.connect()
        await client.query('BEGIN')
        client.query('INSERT INTO events (event_id, team_id, event_type_id,  event_date, text) VALUES ($1, $2, $3, $4, $5)', [event_id, team_id, event_type, date, description], function(err, result) {
            if(err){console.log(err);}
            else {
                client.query('COMMIT')
                client.release();
                callback(err, result);
            }
        });
    },

    getEventsByTeam:async function(team_id, callback) {
        const client = await pool.connect()
        await client.query('BEGIN')
        client.query('SELECT e.event_date AS date, e.text AS text, et.event_color AS color FROM events e INNER JOIN event_types et ON e.event_type_id = et.event_type_id WHERE team_id = $1 AND event_date > NOW()', [team_id], function(err, result) {
            if(err){console.log(err);}
            else {
                client.release();
                callback(err, result);
            }
        });
    },
}

module.exports = dao;