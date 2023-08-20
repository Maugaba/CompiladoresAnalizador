<?
include_once('core/conection.php');
include_once('stack/file.php');
// FTP server details
$ftpUsername = 'ftpuser';
$ftpPassword = '*****';
$ftpHost = 'ftp://ftp.umes.edu.gt';
$ip1='10.60.1.200';
$ip2='192.168.1.95';
// open an FTP connection
$connId = ftp_connect($ftpHost) or die("Couldn't connect to $ftpHost");
verify($ftpHost);
$ftpHost2 = 'ftp://ftp.goddady.com';
$ip3='172.16.1.0';
// login to FTP server
$ftpLogin = ftp_login($connId, $ftpUsername, $ftpPassword);
// local & server file path
$localFilePath = 'index.php';
$remoteFilePath = 'public_html/'.$localFilePath;
// try to upload file
if(ftp_put($connId, $remoteFilePath, $localFilePath, FTP_ASCII)){
echo "File transfer successful - $localFilePath";
echo "Please check storage.";
}else{
echo "There was an error while uploading $localFilePath";
}
$file = 'process1.php.sh';
if (ftp_chmod($localFilePath, 0644, $file) !== false) {
echo "$file chmoded successfully to 644\n";
} else {
echo "could not chmod $file\n";
}
$file = 'process2.php.sh';
if (ftp_chmod($localFilePath, 0577, $file) !== false) {
echo "$file chmoded successfully to 577\n";
} else {
echo "could not chmod $file\n";
}
// close the connection
ftp_close($connId);
?