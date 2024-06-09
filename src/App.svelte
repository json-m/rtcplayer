<script>
  import { onMount } from 'svelte';
  import { Button, Spinner } from 'flowbite-svelte'
  import OvenPlayer from "./lib/OvenPlayer.svelte";
  import Landing from "./lib/Landing.svelte";
  import Capture from "./lib/Capture.svelte";

  let streamName = ''; // Initialize with an empty string
  let streamExists = true;
  let loading = true;

  async function checkStreamExists() {
    const response = await fetch(`https://v.zj.is/s?stream=${streamName}`);

    if (response.status === 204) {
      console.log('Stream exists');
      streamExists = true;
    } else {
      console.log('Stream does not exist');
      streamExists = false;
    }
    loading = false;
  }

  onMount(async () => {
    // Get the stream name from the URL path
    const path = window.location.pathname;
    const urlStreamName = path.split('/').pop();
    if (urlStreamName) {
      streamName = urlStreamName;
      await checkStreamExists();
    } else {
      loading = false;
    }
  });

  //$: videoUrl = `wss://v.zj.is/app/${streamName}?transport=tcp`;

</script>

<main>
  {#if loading}
    <div><Button color="dark"><Spinner class="me-3" size="4" />Loading ...</Button></div>
  {:else if streamName && streamExists}
    <!-- Wrapper element for sizing or positioning the player -->
    <div class="player-wrapper">
      <!-- OvenPlayer will be initialized inside this element. -->
      <div id="player_id">
        <OvenPlayer {streamName} autoplay={true} muted={true} />
      </div>
    </div>
  {:else if streamName && !streamExists}
    <!-- Show the capture window component when the stream doesn't exist -->
    <Capture {streamName} />
  {:else}
    <!-- Show a different component when no stream name is set -->
    <Landing />
  {/if}
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: black;
  }

  main {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .player-wrapper {
    position: relative;
    width: 100%;
    padding-top: 56.25%; /* 16:9 aspect ratio (9 / 16 = 0.5625) */
  }

  #player_id {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>