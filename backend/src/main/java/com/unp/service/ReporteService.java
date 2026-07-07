package com.unp.service;

import com.unp.dto.PostulanteResponse;
import com.unp.repository.PostulanteRepository;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReporteService {

    private final PostulanteRepository postulanteRepository;

    public void exportarCSV(HttpServletResponse response) throws IOException {
        response.setContentType("text/csv;charset=UTF-8");
        response.setHeader("Content-Disposition", "attachment; filename=postulantes.csv");

        List<Object[]> data = postulanteRepository.findAllConAreaCarrera().stream()
                .map(p -> new Object[]{
                        p.getNumeroDocumento(), p.getNombres(), p.getApellidos(),
                        p.getEmail(), p.getTelefono(),
                        p.getArea() != null ? p.getArea().getNombre() : "",
                        p.getCarrera() != null ? p.getCarrera().getNombre() : "",
                        p.getFechaRegistro() != null ? p.getFechaRegistro().toString() : ""
                })
                .toList();

        try (PrintWriter writer = response.getWriter()) {
            writer.println("DNI,Nombres,Apellidos,Email,Telefono,Area,Carrera,Fecha Registro");
            for (Object[] row : data) {
                writer.println(String.join(",",
                        String.valueOf(row[0] != null ? "\"" + row[0] + "\"" : ""),
                        String.valueOf(row[1] != null ? "\"" + row[1] + "\"" : ""),
                        String.valueOf(row[2] != null ? "\"" + row[2] + "\"" : ""),
                        String.valueOf(row[3] != null ? "\"" + row[3] + "\"" : ""),
                        String.valueOf(row[4] != null ? "\"" + row[4] + "\"" : ""),
                        String.valueOf(row[5] != null ? "\"" + row[5] + "\"" : ""),
                        String.valueOf(row[6] != null ? "\"" + row[6] + "\"" : ""),
                        String.valueOf(row[7] != null ? "\"" + row[7] + "\"" : "")
                ));
            }
        }
    }

    public void exportarExcel(HttpServletResponse response) throws IOException {
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=postulantes.xlsx");

        List<Object[]> data = postulanteRepository.findAllConAreaCarrera().stream()
                .map(p -> new Object[]{
                        p.getNumeroDocumento(), p.getNombres(), p.getApellidos(),
                        p.getEmail(), p.getTelefono(),
                        p.getArea() != null ? p.getArea().getNombre() : "",
                        p.getCarrera() != null ? p.getCarrera().getNombre() : "",
                        p.getFechaRegistro() != null ? p.getFechaRegistro().toString() : ""
                })
                .toList();

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Postulantes");
            String[] headers = {"DNI", "Nombres", "Apellidos", "Email", "Telefono", "Area", "Carrera", "Fecha Registro"};

            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            CellStyle headerStyle = workbook.createCellStyle();
            headerStyle.setFont(headerFont);

            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowNum = 1;
            for (Object[] rowData : data) {
                Row row = sheet.createRow(rowNum++);
                for (int i = 0; i < rowData.length; i++) {
                    row.createCell(i).setCellValue(rowData[i] != null ? rowData[i].toString() : "");
                }
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(response.getOutputStream());
        }
    }

    public void exportarPDF(HttpServletResponse response) throws IOException {
        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=postulantes.pdf");

        List<Object[]> data = postulanteRepository.findAllConAreaCarrera().stream()
                .map(p -> new Object[]{
                        p.getNumeroDocumento(), p.getNombres(), p.getApellidos(),
                        p.getArea() != null ? p.getArea().getNombre() : "",
                        p.getCarrera() != null ? p.getCarrera().getNombre() : ""
                })
                .toList();

        try {
            com.lowagie.text.Document document = new com.lowagie.text.Document();
            com.lowagie.text.pdf.PdfWriter.getInstance(document, response.getOutputStream());
            document.open();

            var titleFont = new com.lowagie.text.Font(com.lowagie.text.Font.HELVETICA, 16, com.lowagie.text.Font.BOLD);
            document.add(new com.lowagie.text.Paragraph("Reporte de Postulantes", titleFont));
            document.add(new com.lowagie.text.Paragraph(" "));

            com.lowagie.text.pdf.PdfPTable table = new com.lowagie.text.pdf.PdfPTable(5);
            table.setWidthPercentage(100);
            String[] headers = {"DNI", "Nombres", "Apellidos", "Area", "Carrera"};
            for (String h : headers) {
                table.addCell(new com.lowagie.text.Phrase(h, new com.lowagie.text.Font(com.lowagie.text.Font.HELVETICA, 10, com.lowagie.text.Font.BOLD)));
            }

            for (Object[] rowData : data) {
                for (Object cell : rowData) {
                    table.addCell(cell != null ? cell.toString() : "");
                }
            }

            document.add(table);
            document.close();
        } catch (Exception e) {
            throw new IOException("Error al generar PDF", e);
        }
    }
}
