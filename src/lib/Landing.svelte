<script>
    import { Heading, A, List, Li, Hr, Alert } from 'flowbite-svelte';
    import {getRandomCountry} from "./random.js";

    document.title = "Stream"

    let country = getRandomCountry();
</script>

<div class="no-stream-container">
    <div style="text-align: left;">
        <Heading tag="h4">Stream from browser (lower quality):</Heading>
        <List tag="ol">
            <Li>Go to any unused page, like: <A href="{country}">/{country}</A></Li>
            <Li>Click "Start Streaming"</Li>
            <Li>Accept capture permissions</Li>
            <Li>Select window to capture</Li>
            <br />
            <Alert color="yellow">
                <span class="font-medium">Chrome: Audio capture limited to full screen or tab capture<br/>Firefox:&nbsp;&nbsp;&nbsp;Audio capture not available</span>
            </Alert>
        </List>
        <Hr />
        <Heading tag="h4">Stream from OBS (higher quality):</Heading>
        <List tag="ol" >
            <Li>Open OBS settings</Li>
            <Li>Click on "Stream"</Li>
            <Li>Click on the Service dropdown, select "Custom..."</Li>
            <Li>In the text box, put: <A class="underline hover:no-underline" href="rtmp://v.zj.is:1935/app">rtmp://v.zj.is:1935/app</A></Li>
            <Li>In Stream Key put a random name, like: {country}</Li>
            <Li>Click on "Output"</Li>
            <Li>Click on "Streaming" and copy <A target="_blank" href="https://c.zj.is/obs-settings.jpg">these settings</A></Li>
            <Li>Browse to <A href="#">https://v.zj.is/{country}</A></Li>
        </List>
        <br />
        <Alert color="red"><span>For OBS, it's very important that you use the following:</span><br /><br />
            <List tag="ul">
                <Li>profile=baseline</Li>
                <Li>keyframes=1second</Li>
                <Li>bframes=0</Li>
                <Li>tune=zerolatency</Li>
            </List><br />
            Some options might have <i><b>slightly</b></i> different names for you.<br/>You may use any x264/h264 encoder or bitrate.
        </Alert>
    </div>
</div>

<style>
    .no-stream-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        text-align: center;
    }
</style>