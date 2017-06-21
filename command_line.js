const neodoc = require('neodoc');
var PubSub = require('pubsub-js');

module.exports = (gameCtrl) => {

  function usage() {
    return `
      Usage:
        ssb_chess invite <invitee_pub_key> <as_white>
        ssb_chess accept_invite <game_id>

        ssb_chess pending_invites_sent
        ssb_chess pending_invites_received

        ssb_chess list_games
        ssb_chess list_games_my_move
        ssb_chess situation <game_id>

        ssb_chess move <game_id> <orig_square> <dest_square>
      `;
  }

  function runCommand(args) {

    if (args["list_games"]) {
      gameCtrl.getMyGamesInProgress().then(gameIds => {
        console.log("games:");
        gameIds.forEach(console.dir);
        console.log(gameIds.length);
      });
    } else if (args["list_games_my_move"]) {
      gameCtrl.getGamesWhereMyMove().then(summaries => console.dir(summaries));
    }else if (args["situation"]) {
      const situationGameId = args["<game_id>"];

      gameCtrl.getSituation(situationGameId).then(situation => console.dir(situation));
    } else if (args["invite"]) {
      const invitee = args["<invitee_pub_key>"];
      const asColour = args["<as_white>"];
      console.log("asColour: " + asColour + " type: " + typeof(asColour));

      if ((asColour !== true) && (asColour !== false)) {
        console.error("asWhite must be true or false");
      } else {
        gameCtrl.inviteToPlay(invitee, asColour);
      }
    } else if (args["accept_invite"]) {
      const gameId = args["<game_id>"];
      console.log("Game idarooni: " + gameId);

      gameCtrl.acceptChallenge(gameId);
    } else if (args["pending_invites_sent"]) {
      gameCtrl.pendingChallengesSent().then(res => {
        console.log("Pending invites sent: ");
        console.dir(res);
      });
    } else if (args["pending_invites_received"]) {
      gameCtrl.pendingChallengesReceived().then(res => {
        console.log("Pending invites received: ");
        console.dir(res);
      });
    } else if (args["move"]) {
      const moveInGameId = args["<game_id>"];
      const orig = args["<orig_square>"];
      const dest = args["<dest_square>"];

      gameCtrl.makeMove(moveInGameId, orig, dest); //.then(result => console.dir(result)).catch(err => "error: " + console.dir(err));
    }
  }

  PubSub.subscribe("move", (msg, data) => {
    if (msg === "move") {
      console.log("move");
      console.dir(data);
    } else if (msg === "move_error") {

    } else {
      console.dir("Unexpected message: " + msg);
    }
  })

  const args = neodoc.run(usage());
  runCommand(args);

  return "stuff";

}