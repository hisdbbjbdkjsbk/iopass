<?php
//Import PHPMailer classes into the global namespace
//These must be at the top of your script, not inside a function
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require './PHPMailer/src/Exception.php';
require './PHPMailer/src/PHPMailer.php';
require './PHPMailer/src/SMTP.php';
require './from.php'; // include and import variable $html from from.php (email template)

//Create an instance; passing `true` enables exceptions
$mail = new PHPMailer(true);
$mail->CharSet = PHPMailer::CHARSET_UTF8;

//To load the Russian version
// $mail->setLanguage('ru', './PHPMailer/language/');

try {
    //Server settings
    // $mail->SMTPDebug = SMTP::DEBUG_SERVER;                   //Enable verbose debug output
    $mail->isSMTP();                                            //Send using SMTP
    $mail->Host = 'smtp.hostinger.com';                     //Set the SMTP server to send through
    // $mail->Host = 'mail.iopass.io';                     //Set the SMTP server to send through
    $mail->SMTPAuth = true;                                   //Enable SMTP authentication
    // $mail->Username = 'site@iopass.io';                     //SMTP username
    // $mail->Password = 'Lnv$L!}3Ja80';                               //SMTP password
    $mail->Username = 'no-reply@dev-geis.pp.ua';                     //SMTP username
    $mail->Password = 'i*5FM2ueS}3';                                //SMTP password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            //Enable implicit TLS encryption
    $mail->Port = 465;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`

    //Recipients
    $mail->setFrom('no-reply@dev-geis.pp.ua', 'Site visitor');
    // $mail->setFrom('site@iopass.io', 'Site visitor');
    $mail->addAddress('tsindalex@yahoo.com', 'GeicA');     //Add a recipient
    $mail->addAddress('1914.ac@gmail.com', 'GeicA');               //Name is optional
    // $mail->addReplyTo('info@example.com', 'Information');
    // $mail->addCC('cc@example.com');
    // $mail->addBCC('bcc@example.com');

    //Attachments
    // $mail->addAttachment('/var/tmp/file.tar.gz');         //Add attachments
    // $mail->addAttachment('/tmp/image.jpg', 'new.jpg');    //Optional name

    //Content
    $mail->isHTML(true);                                  //Set email format to HTML
    $mail->Subject = 'Message from a site visitor IOPASS';

    if (trim(!empty($_POST['message']))) {
        /* $body = '<h3 style="padding: 15px;">Visitor\'s message</h3>';
        $body .= 'Site visitor message: <br>' . '<pre><p style="padding: 25px; border: 1px solid lightgrey; border-radius: 8px; display: inline-block;font-style: italic; font-weight: 700;">' . '"' . $_POST['message'] . '"' . '</p></pre>'; */
        $altBody = 'Site visitor message: ' . '"' . $_POST['message'] . '"';
    }
    if (trim(!empty($_POST['email']))) {
        /* if (trim(empty($_POST['message']))) {
            $body .= '<h3 style="padding: 15px;">Card order</h3>';
        }
        $body .= '<p style="padding: 10px;">' . 'Site visitor contact E-mail: ' . '<span style="display: inline-block; padding: 15px; border-radius: 8px; background-color: lightgrey; font-weight: 700">' . $_POST['email'] . '</span>' . '</p>'; */

        $altBody .= '||| Site visitor contact E-mail: ' . $_POST['email'] . ' |||';
    }

    $mail->AddEmbeddedImage('img/logo-dark.png', 'logo-dark');
    $mail->Body = $html;
    $mail->AltBody = $altBody;

    if (!$mail->send()) {
        $msg = 'Error';
        $status = false;
    } else {
        $msg = 'Message has been sent';
        $status = true;
        // echo 'Message has been sent';
    };

    $response = ['msg' => $msg, 'status' => $status];
    header('Content-type: application/json');
    echo json_encode($response);
} catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}
