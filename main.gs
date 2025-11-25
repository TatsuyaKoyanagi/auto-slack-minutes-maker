var icon = ':page_facing_up:';  // 通知時に表示されるアイコン

/**
 * @file Google Apps Script for generating a weekly Google Doc from a template and posting its link to Slack.
 * @author コーディング パートナー
 * @version 1.0
 */

/**
 * メイン関数：週次レポートを生成し、Slackに投稿します。
 * この関数は、時間駆動型トリガーによって自動実行されるように設定されます。
 */

function createAndPostWeeklyReport() {
  // コピー元となるGoogleドキュメントのテンプレートID
  const TEMPLATE_DOCUMENT_ID = 'template documetn id'; 
  // SlackのWebhook URL
  const SLACK_WEBHOOK_URL = 'slack Slack Webhook url'; 
  
  const NEW_DOCUMENT_TITLE_FORMAT = '{date}_定期';

  try {
    // 1. 新しいドキュメントのタイトルを生成
    const today = new Date();
    today.setDate(today.getDate() + 2);

    // 日付をYYYYMMDD形式でフォーマット
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // 月は0から始まるため+1
    const day = today.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}${month}${day}`;
    const newDocumentTitle = NEW_DOCUMENT_TITLE_FORMAT.replace('{date}', formattedDate);

    Logger.log(`新しいドキュメントタイトル: ${newDocumentTitle}`);

    // 2. Googleドキュメントのテンプレートをコピー
    const templateFile = DriveApp.getFileById(TEMPLATE_DOCUMENT_ID);
    const copiedFile = templateFile.makeCopy(newDocumentTitle);
    const documentUrl = copiedFile.getUrl();
    const documentId = copiedFile.getId();

    Logger.log(`ドキュメント '${newDocumentTitle}' をコピーしました。ID: ${documentId}, URL: ${documentUrl}`);

    // 3. Slackに投稿
    const payload = {
      text: `@channel \n定期ミーティングの議事録です。 \n出欠確認スタンプとタスクリーダーの記入は ${month}/${day}(金)12:00までにお願いします。\n <${documentUrl}|議事録リンク>`,
      link_names: 1,
      mrkdwn: true 
    };

    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload)
    };

    UrlFetchApp.fetch(SLACK_WEBHOOK_URL, options);
    Logger.log('Slackにメッセージを投稿しました。');

  } catch (e) {
    Logger.log(`エラーが発生しました: ${e.message}`);
  }
}

function testRun() {
  createAndPostWeeklyReport();
}
