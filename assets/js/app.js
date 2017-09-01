$(document).ready(function() {
	$('.register').on('submit', function(e) {
		e.preventDefault();
		$.ajax({
			method: 'POST',
			url: '/register',
			data: {
				firstName: $('#firstName').val(),
				lastName: $('#lastName').val(),
				username: $('#username').val(),
				password: $('#password').val(),
				passwordConfirm: $('#passwordConfirm').val(),
				email: $('#email').val()
			},
			success: function(response) {
				if (response.code == 1) {
					alert('Successful registration');
					Cookies.set('sesid', response.sesID);
					window.location.replace('/account');
				}
			},
			error: function(jqXHR, errorText, errorThrown) {
				console.log(errorText);
			}
		});
	});
	$('.login-box').on('submit', function(e) {
		e.preventDefault();
		$.ajax({
			method: 'POST',
			url: '/login',
			data: {
				username: $('#username').val(),
				password: $('#password').val()
			},
			success: function(response) {
				if (response.code == -1) {
					alert('Incorrect login or password!');
				} else if (response.code == 1) {
					Cookies.set('sesid', response.sesID);
					window.location.replace('/account')
				}
			},
			error: function(jqXHR, errorText, errorThrown) {
				console.log(errorText);
			}
		});
	});
	$('.change').on('submit', function(e) {
		e.preventDefault();
		$.ajax({
			method: 'POST',
			url: '/money',
			data: {
				amount: $('#amount').val(),
				password: $('#password').val()
			},
			success: function(response) {
				if (response.code == 1) {
					alert('Successfully aded money to account')
				}
			}
		})
	});
	$('.buy-item').on('click', function() {
		var companyCode = $(this).data('code');
		var canIBuy = $(this).parents('table').data('canBuy');
		if (canIBuy) {
			$.ajax({
				method: 'POST',
				url: '/buy',
				data: {
					companyCode: companyCode
				},
				success: function(resp) {
					if (resp.code == -1) {
						alert('Can\'t buy, try again later');
					} else {
						alert('Bought it');
						location.reload();
					}
				}
			});
		} else {
			alert('Something went wrong, reload page and try again')
		}
	});
	$('.sell-btn').on('click', function() {
		$.ajax({
			method: 'POST',
			url: '/sell',
			data: {
				companyCode: $(this).data('company'),
				walletCode: $(this).data('wallet')
			},
			success: function(response) {
				if (response.code == -1) {
						alert('Can\'t sell, try again later');
					} else {
						alert('Sold it');
						location.reload();
					}
			}
		})
	});
});