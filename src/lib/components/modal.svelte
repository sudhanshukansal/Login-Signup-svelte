<script>
  import { userOtp } from '$lib/stores/userOtp';
	import { onMount } from 'svelte';
	// import { userOtp } from '$lib/store/userOtp';

	export let showModal;
	export let dialog;
    export let email;

    

	let verification = '';
	let otpMessage = '';
	let otp = [' ', '', '', ''];
	let time = 10;
	let buttonEnabled = false;
	let timerInterval;

	// Handle OTP input for each field
	function handleInput(event, index) {
		let value = event.target.value.replace(/\D/g, ''); // Only allow digits
		otp[index] = value;

		if (value && index < otp.length - 1) {
			document.getElementById(`otp-${index + 1}`).focus(); // Move forward
		} else if (!value && event.inputType === 'deleteContentBackward' && index > 0) {
			document.getElementById(`otp-${index - 1}`).focus(); // Move backward
		}

		otpMessage = ''; // Clear message on new input
	}

	// Resend OTP and reset timer
	function handleClick() {
		if (buttonEnabled) {
			verification = $userOtp;
			console.log('Resent OTP:', verification);
			startTimer();
			otpMessage = ''; // Clear OTP message
		}
	}

	// Start or restart the timer
	function startTimer() {
		time = 10;
		buttonEnabled = false;
		clearInterval(timerInterval);

		timerInterval = setInterval(() => {
			if (time > 0) {
				time -= 1;
			} else {
				clearInterval(timerInterval);
				buttonEnabled = true;
			}
		}, 1000);
	}

	$: if (dialog && showModal) {
		dialog.showModal();
		startTimer();
	}

	$: if (!showModal && dialog) {
		dialog.close();
		clearInterval(timerInterval); // Clear i9timer if modal is closed
	}
	onMount(() => {
		if (showModal) {
			startTimer();
			verification = $userOtp;
		}
	});
</script>

<dialog bind:this={dialog} on:close={() => (showModal = false)}>
	<div>
		<slot name="header" />
		<p class="text-primary text-center font-bold">Send an OTP on your Gmail</p>

		<div class="m-3 flex space-x-4">
			{#each otp as _, index}
				<input
					id={'otp-' + index}
					type="text"
					bind:value={otp[index]}
					on:input={(event) => handleInput(event, index)}
					maxlength="1"
					class="h-12 w-12 rounded-md border-2 border-gray-300 text-center text-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			{/each}
		</div>
		<div class="m-3 text-center">
			{#if time === 0}
				<p class="text-blue cursor-pointer underline" on:click={handleClick}>Resend OTP</p>
			{:else}
				<p>Retry in {time} second{time > 1 ? 's' : ''}.</p>
			{/if}
		</div>
		<p class="text-center text-red-500">{otpMessage}</p>
		<div class="flex gap-x-3">
			<button
				
				class="rounded-lg bg-blue-500 px-6 py-2 text-lg font-semibold text-white shadow transition hover:bg-sky-700"
			>
				Submit OTP
			</button>

			<form method="post" action="?/pending">
             
				<button
					type="submit"
					class="rounded-lg px-6 py-2 text-lg font-semibold shadow transition"
					class:bg-blue-500={buttonEnabled}
					class:bg-gray-400={!buttonEnabled}
					class:text-white={buttonEnabled}
					class:text-gray-600={!buttonEnabled}
					class:cursor-not-allowed={!buttonEnabled}
					disabled={!buttonEnabled}
				>
					Resend
				</button>
			</form>
		</div>
		<slot />
	</div>
</dialog>

<style>
	dialog {
		max-width: 32em;
		border-radius: 0.2em;
		border: none;
		padding: 0;
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
	dialog > div {
		padding: 1em;
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
