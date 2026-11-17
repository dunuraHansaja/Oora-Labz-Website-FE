<?php
header('Access-Control-Allow-Origin: *');

$ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

if (isset($_GET['image_url'])) {
    $imgUrl = $_GET['image_url'];
    if (!preg_match('/^https:\/\/[a-z0-9.-]+\.(fbcdn\.net|cdninstagram\.com)\//i', $imgUrl)) {
        http_response_code(400);
        exit('Invalid image URL');
    }
    $ch = curl_init($imgUrl);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_USERAGENT => $ua,
        CURLOPT_TIMEOUT => 12,
    ]);
    $data = curl_exec($ch);
    $contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE) ?: 'image/jpeg';
    curl_close($ch);
    header('Content-Type: ' . $contentType);
    header('Cache-Control: public, max-age=300');
    echo $data;
    exit;
}

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, max-age=0');

$username = isset($_GET['username']) ? preg_replace('/[^a-zA-Z0-9._]/', '', $_GET['username']) : 'oora_labz';
if (!$username) {
    $username = 'oora_labz';
}

$embedUrl = "https://www.instagram.com/{$username}/embed/";
$ch = curl_init($embedUrl);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_USERAGENT => $ua,
    CURLOPT_HTTPHEADER => [
        'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language: en-US,en;q=0.9',
    ],
    CURLOPT_TIMEOUT => 12,
]);
$html = curl_exec($ch);
curl_close($ch);

if (!$html || !preg_match('/"contextJSON"\s*:\s*("(?:\\\\.|[^"\\\\])*")/', $html, $matches)) {
    http_response_code(502);
    echo json_encode(['error' => 'Unable to parse Instagram embed feed']);
    exit;
}

$jsonStr = json_decode($matches[1], true);
$payload = json_decode($jsonStr, true);
$mediaItems = isset($payload['context']['graphql_media']) ? $payload['context']['graphql_media'] : [];

$posts = [];
foreach ($mediaItems as $item) {
    if (!empty($item['shortcode_media'])) {
        $posts[] = $item['shortcode_media'];
    }
}

usort($posts, function ($a, $b) {
    return ($b['taken_at_timestamp'] ?? 0) <=> ($a['taken_at_timestamp'] ?? 0);
});

if (empty($posts)) {
    http_response_code(404);
    echo json_encode(['error' => 'No public posts found']);
    exit;
}

$latest = $posts[0];
$shortcode = $latest['shortcode'] ?? '';
$directMediaUrl = $latest['display_url'] ?? '';
$caption = $latest['edge_media_to_caption']['edges'][0]['node']['text'] ?? '';
$likes = isset($latest['edge_liked_by']['count']) ? (int)$latest['edge_liked_by']['count'] : 0;
$comments = isset($latest['edge_media_to_comment']['count']) ? (int)$latest['edge_media_to_comment']['count'] : 0;
$timestamp = isset($latest['taken_at_timestamp']) ? ((int)$latest['taken_at_timestamp'] * 1000) : null;

echo json_encode([
    'username' => $username,
    'shortcode' => $shortcode,
    'permalink' => "https://www.instagram.com/p/{$shortcode}/",
    'mediaUrl' => $directMediaUrl ? ('assets/php/instagram-latest.php?image_url=' . urlencode($directMediaUrl)) : '',
    'directMediaUrl' => $directMediaUrl,
    'caption' => $caption,
    'likes' => $likes,
    'comments' => $comments,
    'timestamp' => $timestamp,
    'isVideo' => !empty($latest['is_video']),
]);

