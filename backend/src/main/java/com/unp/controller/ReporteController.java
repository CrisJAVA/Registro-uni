package com.unp.controller;

import com.unp.service.ReporteService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/reportes")
@RequiredArgsConstructor
public class ReporteController {

    private final ReporteService reporteService;

    @GetMapping("/csv")
    public void exportarCSV(HttpServletResponse response) throws IOException {
        reporteService.exportarCSV(response);
    }

    @GetMapping("/excel")
    public void exportarExcel(HttpServletResponse response) throws IOException {
        reporteService.exportarExcel(response);
    }

    @GetMapping("/pdf")
    public void exportarPDF(HttpServletResponse response) throws IOException {
        reporteService.exportarPDF(response);
    }
}
