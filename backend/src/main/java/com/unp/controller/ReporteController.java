package com.unp.controller;

import com.unp.security.AdminPrincipal;
import com.unp.service.ReporteService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/reportes")
@RequiredArgsConstructor
public class ReporteController {

    private final ReporteService reporteService;

    @GetMapping("/csv")
    public void exportarCSV(HttpServletResponse response, Authentication auth) throws IOException {
        verificarAdmin(auth);
        reporteService.exportarCSV(response);
    }

    @GetMapping("/excel")
    public void exportarExcel(HttpServletResponse response, Authentication auth) throws IOException {
        verificarAdmin(auth);
        reporteService.exportarExcel(response);
    }

    @GetMapping("/pdf")
    public void exportarPDF(HttpServletResponse response, Authentication auth) throws IOException {
        verificarAdmin(auth);
        reporteService.exportarPDF(response);
    }

    private void verificarAdmin(Authentication auth) {
        if (auth == null || !(auth.getPrincipal() instanceof AdminPrincipal)) {
            throw new RuntimeException("Acceso no autorizado. Se requiere rol de administrador.");
        }
    }
}
