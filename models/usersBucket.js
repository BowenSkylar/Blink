const db = require('./../lib/dbConnect');

function getAllActivities(req, res, next) {
  /*select all from events table where current
  session id matches session id associated with events */
  db.any('SELECT * from events WHERE session_id = $1')
    .then((activities) => {
      res.activities = activities;
      next();
    })
    .catch(error => next(error));
}

function addToBucket(req, res, next) {
  db.one(`SELECT * FROM events
          WHERE user_id = $/user_id/
            AND place_id = $/place_id/;`, req.body)
    .then(() => {
      console.log('Duplicate event, not adding');
      next()
    })
    .catch((err) => {
      console.log('--> No event found, adding event');
        if(req.body.rating === undefined){
          req.body.rating = 0;
        }
      db.none(`INSERT INTO events (user_id, name, icon, rating, formatted_address, place_img, place_id, status)
              VALUES ($/user_id/, $/name/, $/icon/, $/rating/, $/formatted_address/, $/place_img/, $/place_id/, $/status/);`, req.body)
        .then(() => next())
        .catch((err) => {
          console.log(`--> addToBucket error: ${err}`);
        })
    })
}
function getBucketPending(req, res, next) {
  db.query(`SELECT events.* FROM users
          INNER JOIN events
          ON(users.id = events.user_id)
          WHERE users.session_id = $/sessionID/
          AND events.status = 'pending';`, req)
    .then((data) => {
      res.data = {
        pending: data,
        completed: 'none'
      }
      next()
    })
    .catch((err) => {
      console.log(`--> getBucketPending error: ${err}`);
    })
}
function getBucketCompleted(req, res, next) {
  db.query(`SELECT events.* FROM users
            INNER JOIN events
            ON(users.id = events.user_id)
            WHERE users.session_id = $/sessionID/
            AND events.status = 'completed';`, req)
    .then((data) => {
      res.data.completed = data;
      next()
    })
    .catch((err) => {
      console.log(`--> getBucketCompleted error ${err}`);
    })
}
function completeEvent(req, res, next) {
  db.none(`UPDATE events SET status = 'completed'
            WHERE id = $/id/;`, req.body)
    .then(() => next())
}
function deleteEvent(req, res, next) {
  db.none(`DELETE FROM events
          WHERE id = $/id/;`, req.body)
    .then(() => next())
}

module.exports={
  addToBucket,
  getBucketPending,
  getBucketCompleted,
  completeEvent,
  deleteEvent
}
