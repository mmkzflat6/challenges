const axios = require('axios');

const API_ENDPOINT = 'http://challenge.z2o.cloud';

// 間隔（ミリ秒）を設定
const INTERVAL_MS = 500;

// ニックネームを指定して初回リクエストを実行
function startChallenge(nickname) {
  axios.post(`${API_ENDPOINT}/challenges`, { nickname })
    .then(response => {
      console.log('Challenge started:', response.data);
      scheduleNextChallenge(response.data.actives_at, response.data.id);
    })
    .catch(error => {
      console.error('Error starting challenge:', error.response.data);
    });
}

// チャレンジを定期的に実行するスケジュールを設定
function scheduleNextChallenge(activesAt, challengeId) {
  const now = new Date().getTime();
  const targetTime = new Date(activesAt).getTime();

  const delay = targetTime - now;
  if (delay < 0) {
    // 予定時刻が過去の場合は即時実行
    executeChallenge(challengeId);
  } else {
    setTimeout(() => {
      executeChallenge(challengeId);
    }, delay);
  }
}

// チャレンジを実行する
function executeChallenge(challengeId) {
  axios.put(`${API_ENDPOINT}/challenges`, {}, {
    headers: {
      'X-Challenge-Id': challengeId,
    }
  })
    .then(response => {
      console.log('Challenge executed:', response.data);
      // 次のスケジュールを設定
      scheduleNextChallenge(response.data.actives_at, response.data.id);
    })
    .catch(error => {
      console.error('Error executing challenge:', error.response.data);
      // エラーが発生した場合も次のスケジュールを設定
      scheduleNextChallenge(error.response.data.actives_at, challengeId);
    });
}

// チャレンジを開始するニックネームを指定してプログラムを起動
const nickname = 'KKK';
startChallenge(nickname);


//応募キーワード「Algorithm-Rank1-3593262092」
