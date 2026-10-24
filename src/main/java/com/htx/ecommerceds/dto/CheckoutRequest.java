package com.htx.ecommerceds.dto;

import java.util.List;

public record CheckoutRequest(Integer usuarioId, String pago, List<Item> items) {
	public record Item(Integer productoId, Integer cantidad) {
	}
}