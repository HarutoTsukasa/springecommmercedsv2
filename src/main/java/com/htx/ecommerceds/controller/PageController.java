package com.htx.ecommerceds.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

	@GetMapping({ "/", "/index", "/index.html" })
	public String index() {
		return "index";
	}

	@GetMapping({ "/admin", "/admin.html" })
	public String admin() {
		return "admin";
	}

	@GetMapping({ "/login", "/login.html" })
	public String login() {
		return "login";
	}

	@GetMapping({ "/registro", "/registro.html" })
	public String registro() {
		return "registro";
	}
}