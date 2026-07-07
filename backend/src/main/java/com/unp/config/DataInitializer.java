package com.unp.config;

import com.unp.entity.*;
import com.unp.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final AreaRepository areaRepository;
    private final CarreraRepository carreraRepository;
    private final ProcesoAdmisionRepository procesoAdmisionRepository;
    private final PagoRepository pagoRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (adminRepository.count() == 0) {
            var admin = Administrador.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("123456"))
                    .nombre("Administrador del Sistema")
                    .email("admin@unp.edu.pe")
                    .build();
            adminRepository.save(admin);
            System.out.println("Admin user created: admin / 123456");
        }

        if (areaRepository.count() == 0) {
            var areaA = areaRepository.save(Area.builder().codigo("A").nombre("A - Ciencias de la Salud").build());
            var areaB = areaRepository.save(Area.builder().codigo("B").nombre("B - Ciencias Básicas").build());
            var areaC = areaRepository.save(Area.builder().codigo("C").nombre("C - Ingenierías").build());
            var areaD = areaRepository.save(Area.builder().codigo("D").nombre("D - Ciencias Económicas y de la Gestión").build());
            var areaE = areaRepository.save(Area.builder().codigo("E").nombre("E - Humanidades y Ciencias Jurídicas").build());

            carreraRepository.save(Carrera.builder().nombre("Medicina Humana").area(areaA).build());
            carreraRepository.save(Carrera.builder().nombre("Enfermería").area(areaA).build());
            carreraRepository.save(Carrera.builder().nombre("Odontología").area(areaA).build());
            carreraRepository.save(Carrera.builder().nombre("Farmacia y Bioquímica").area(areaA).build());
            carreraRepository.save(Carrera.builder().nombre("Psicología").area(areaA).build());
            carreraRepository.save(Carrera.builder().nombre("Nutrición").area(areaA).build());

            carreraRepository.save(Carrera.builder().nombre("Biología").area(areaB).build());
            carreraRepository.save(Carrera.builder().nombre("Química").area(areaB).build());
            carreraRepository.save(Carrera.builder().nombre("Física").area(areaB).build());
            carreraRepository.save(Carrera.builder().nombre("Matemática").area(areaB).build());

            carreraRepository.save(Carrera.builder().nombre("Ingeniería de Sistemas").area(areaC).build());
            carreraRepository.save(Carrera.builder().nombre("Ingeniería Civil").area(areaC).build());
            carreraRepository.save(Carrera.builder().nombre("Ingeniería Industrial").area(areaC).build());
            carreraRepository.save(Carrera.builder().nombre("Ingeniería Ambiental").area(areaC).build());

            carreraRepository.save(Carrera.builder().nombre("Administración").area(areaD).build());
            carreraRepository.save(Carrera.builder().nombre("Contabilidad").area(areaD).build());
            carreraRepository.save(Carrera.builder().nombre("Economía").area(areaD).build());
            carreraRepository.save(Carrera.builder().nombre("Marketing").area(areaD).build());

            carreraRepository.save(Carrera.builder().nombre("Derecho").area(areaE).build());
            carreraRepository.save(Carrera.builder().nombre("Ciencias Políticas").area(areaE).build());
            carreraRepository.save(Carrera.builder().nombre("Comunicación").area(areaE).build());
            carreraRepository.save(Carrera.builder().nombre("Educación").area(areaE).build());

            System.out.println("Areas and careers seeded successfully.");
        }

        if (procesoAdmisionRepository.count() == 0) {
            procesoAdmisionRepository.save(ProcesoAdmision.builder()
                    .anio("2026")
                    .periodo("I")
                    .estado("ABIERTO")
                    .build());
            System.out.println("Admission process seeded.");
        }

        if (pagoRepository.count() == 0) {
            pagoRepository.save(Pago.builder()
                    .nombreCliente("MUNOA AVALOS ANA ELIZABETH")
                    .codigo("20173423")
                    .descripcionPago("051 CARTA PRESENTACION 2 FAC. DE.CCPP")
                    .importePagar(new BigDecimal("15.00"))
                    .importePagado(new BigDecimal("15.00"))
                    .oficina("7799")
                    .numeroMovimiento("626242")
                    .fechaPago(LocalDateTime.of(2023, 12, 18, 23, 11, 23))
                    .fechaProceso(LocalDateTime.of(2023, 12, 19, 0, 0, 0))
                    .formaPago("02")
                    .canal("04")
                    .build());

            pagoRepository.save(Pago.builder()
                    .nombreCliente("JOYO CASAVILCA KELLY BRIGGITH")
                    .codigo("20174630")
                    .descripcionPago("029 CONSTA. LABO. INTERNO FAC. FAR.BIQ")
                    .importePagar(new BigDecimal("15.00"))
                    .importePagado(new BigDecimal("16.50"))
                    .oficina("0817")
                    .numeroMovimiento("626235")
                    .fechaPago(LocalDateTime.of(2023, 12, 18, 20, 25, 20))
                    .fechaProceso(LocalDateTime.of(2023, 12, 18, 0, 0, 0))
                    .formaPago("01")
                    .canal("06")
                    .build());

            pagoRepository.save(Pago.builder()
                    .nombreCliente("JOYO CASAVILCA KELLY BRIGGITH")
                    .codigo("20174630")
                    .descripcionPago("030 CONST. LABO. EXTERNO FAC. FAR.BIQ")
                    .importePagar(new BigDecimal("15.00"))
                    .importePagado(new BigDecimal("16.50"))
                    .oficina("0817")
                    .numeroMovimiento("626234")
                    .fechaPago(LocalDateTime.of(2023, 12, 18, 20, 24, 25))
                    .fechaProceso(LocalDateTime.of(2023, 12, 18, 0, 0, 0))
                    .formaPago("01")
                    .canal("06")
                    .build());

            pagoRepository.save(Pago.builder()
                    .nombreCliente("JOYO CASAVILCA KELLY BRIGGITH")
                    .codigo("20174630")
                    .descripcionPago("034 CONST. NO ADEU LIBR UNI FAC. FAR.BIQ")
                    .importePagar(new BigDecimal("15.00"))
                    .importePagado(new BigDecimal("16.50"))
                    .oficina("0817")
                    .numeroMovimiento("626233")
                    .fechaPago(LocalDateTime.of(2023, 12, 18, 20, 23, 39))
                    .fechaProceso(LocalDateTime.of(2023, 12, 18, 0, 0, 0))
                    .formaPago("01")
                    .canal("06")
                    .build());

            pagoRepository.save(Pago.builder()
                    .nombreCliente("JOYO CASAVILCA KELLY BRIGGITH")
                    .codigo("20174630")
                    .descripcionPago("027 CONST. INGRESO UNICA FAC. FAR.BIQ")
                    .importePagar(new BigDecimal("25.00"))
                    .importePagado(new BigDecimal("26.50"))
                    .oficina("0817")
                    .numeroMovimiento("626232")
                    .fechaPago(LocalDateTime.of(2023, 12, 18, 20, 22, 47))
                    .fechaProceso(LocalDateTime.of(2023, 12, 18, 0, 0, 0))
                    .formaPago("01")
                    .canal("06")
                    .build());

            pagoRepository.save(Pago.builder()
                    .nombreCliente("JOYO CASAVILCA KELLY BRIGGITH")
                    .codigo("20174630")
                    .descripcionPago("032 CONST. NO ADEU DINE UNI FAC. FAR.BIQ")
                    .importePagar(new BigDecimal("15.00"))
                    .importePagado(new BigDecimal("16.50"))
                    .oficina("0817")
                    .numeroMovimiento("626231")
                    .fechaPago(LocalDateTime.of(2023, 12, 18, 20, 22, 3))
                    .fechaProceso(LocalDateTime.of(2023, 12, 18, 0, 0, 0))
                    .formaPago("01")
                    .canal("06")
                    .build());

            pagoRepository.save(Pago.builder()
                    .nombreCliente("ALVAREZ GUERRA GIANELLA TIFFAN")
                    .codigo("20150767")
                    .descripcionPago("040 CONST. 1RA MAT. SUNEDU FAC. ENFRIA.")
                    .importePagar(new BigDecimal("15.00"))
                    .importePagado(new BigDecimal("16.50"))
                    .oficina("0817")
                    .numeroMovimiento("626230")
                    .fechaPago(LocalDateTime.of(2023, 12, 18, 20, 18, 15))
                    .fechaProceso(LocalDateTime.of(2023, 12, 18, 0, 0, 0))
                    .formaPago("01")
                    .canal("06")
                    .build());

            pagoRepository.save(Pago.builder()
                    .nombreCliente("ALVAREZ GUERRA GIANELLA TIFFAN")
                    .codigo("20150767")
                    .descripcionPago("024 CONSTANCIA EGRESADO FAC. ENFRIA.")
                    .importePagar(new BigDecimal("20.00"))
                    .importePagado(new BigDecimal("21.50"))
                    .oficina("0817")
                    .numeroMovimiento("626229")
                    .fechaPago(LocalDateTime.of(2023, 12, 18, 20, 17, 18))
                    .fechaProceso(LocalDateTime.of(2023, 12, 18, 0, 0, 0))
                    .formaPago("01")
                    .canal("06")
                    .build());

            pagoRepository.save(Pago.builder()
                    .nombreCliente("ALVAREZ GUERRA GIANELLA TIFFAN")
                    .codigo("20150767")
                    .descripcionPago("722 CONSTANCIA CREDITAJE FAC. ENFRIA.")
                    .importePagar(new BigDecimal("15.00"))
                    .importePagado(new BigDecimal("16.50"))
                    .oficina("0817")
                    .numeroMovimiento("626227")
                    .fechaPago(LocalDateTime.of(2023, 12, 18, 20, 14, 49))
                    .fechaProceso(LocalDateTime.of(2023, 12, 18, 0, 0, 0))
                    .formaPago("01")
                    .canal("06")
                    .build());

            pagoRepository.save(Pago.builder()
                    .nombreCliente("ALVAREZ GUERRA GIANELLA TIFFAN")
                    .codigo("20150767")
                    .descripcionPago("028 CONST. INSC. LIBR. ING. FAC. ENFRIA.")
                    .importePagar(new BigDecimal("15.00"))
                    .importePagado(new BigDecimal("16.50"))
                    .oficina("0817")
                    .numeroMovimiento("626226")
                    .fechaPago(LocalDateTime.of(2023, 12, 18, 20, 13, 48))
                    .fechaProceso(LocalDateTime.of(2023, 12, 18, 0, 0, 0))
                    .formaPago("01")
                    .canal("06")
                    .build());

            pagoRepository.save(Pago.builder()
                    .nombreCliente("ALVAREZ GUERRA GIANELLA TIFFAN")
                    .codigo("20150767")
                    .descripcionPago("049 CERTIFICADO ESTUDIOS FAC. ENFRIA.")
                    .importePagar(new BigDecimal("50.00"))
                    .importePagado(new BigDecimal("51.50"))
                    .oficina("0817")
                    .numeroMovimiento("626225")
                    .fechaPago(LocalDateTime.of(2023, 12, 18, 20, 12, 51))
                    .fechaProceso(LocalDateTime.of(2023, 12, 18, 0, 0, 0))
                    .formaPago("01")
                    .canal("06")
                    .build());

            pagoRepository.save(Pago.builder()
                    .nombreCliente("ALVAREZ GUERRA GIANELLA TIFFAN")
                    .codigo("20150767")
                    .descripcionPago("064 DERECHO CUADERNILLO FAC. ENFRIA.")
                    .importePagar(new BigDecimal("20.00"))
                    .importePagado(new BigDecimal("21.50"))
                    .oficina("0817")
                    .numeroMovimiento("626223")
                    .fechaPago(LocalDateTime.of(2023, 12, 18, 20, 11, 51))
                    .fechaProceso(LocalDateTime.of(2023, 12, 18, 0, 0, 0))
                    .formaPago("01")
                    .canal("06")
                    .build());

            pagoRepository.save(Pago.builder()
                    .nombreCliente("ALVAREZ GUERRA GIANELLA TIFFAN")
                    .codigo("20150767")
                    .descripcionPago("030 CONST. LABO. EXTERNO FAC. ENFRIA.")
                    .importePagar(new BigDecimal("15.00"))
                    .importePagado(new BigDecimal("16.50"))
                    .oficina("0817")
                    .numeroMovimiento("626221")
                    .fechaPago(LocalDateTime.of(2023, 12, 18, 20, 10, 44))
                    .fechaProceso(LocalDateTime.of(2023, 12, 18, 0, 0, 0))
                    .formaPago("01")
                    .canal("06")
                    .build());

            pagoRepository.save(Pago.builder()
                    .nombreCliente("ALVAREZ GUERRA GIANELLA TIFFAN")
                    .codigo("20150767")
                    .descripcionPago("029 CONSTA. LABO. INTERNO FAC. ENFRIA.")
                    .importePagar(new BigDecimal("15.00"))
                    .importePagado(new BigDecimal("16.50"))
                    .oficina("0817")
                    .numeroMovimiento("626220")
                    .fechaPago(LocalDateTime.of(2023, 12, 18, 20, 9, 35))
                    .fechaProceso(LocalDateTime.of(2023, 12, 18, 0, 0, 0))
                    .formaPago("01")
                    .canal("06")
                    .build());

            pagoRepository.save(Pago.builder()
                    .nombreCliente("RODRIGUEZ ALARCON SUAMY KAREL")
                    .codigo("20186092")
                    .descripcionPago("051 CARTA PRESENTACION 2 FAC. DE.CCPP")
                    .importePagar(new BigDecimal("15.00"))
                    .importePagado(new BigDecimal("16.50"))
                    .oficina("0817")
                    .numeroMovimiento("626218")
                    .fechaPago(LocalDateTime.of(2023, 12, 18, 20, 5, 59))
                    .fechaProceso(LocalDateTime.of(2023, 12, 18, 0, 0, 0))
                    .formaPago("01")
                    .canal("06")
                    .build());

            pagoRepository.save(Pago.builder()
                    .nombreCliente("BERNAOLA ROMUCHO ZIRTAED ALIAN")
                    .codigo("20172129")
                    .descripcionPago("079 ENV REG A LIMA SUNEDU FAC. EDUCAC.")
                    .importePagar(new BigDecimal("15.00"))
                    .importePagado(new BigDecimal("16.50"))
                    .oficina("0817")
                    .numeroMovimiento("626204")
                    .fechaPago(LocalDateTime.of(2023, 12, 18, 19, 37, 0))
                    .fechaProceso(LocalDateTime.of(2023, 12, 18, 0, 0, 0))
                    .formaPago("01")
                    .canal("06")
                    .build());

            pagoRepository.save(Pago.builder()
                    .nombreCliente("BERNAOLA ROMUCHO ZIRTAED ALIAN")
                    .codigo("20172129")
                    .descripcionPago("069 CERTIF. DIPLOMA COPIA FAC. EDUCAC.")
                    .importePagar(new BigDecimal("5.00"))
                    .importePagado(new BigDecimal("6.50"))
                    .oficina("0817")
                    .numeroMovimiento("626203")
                    .fechaPago(LocalDateTime.of(2023, 12, 18, 19, 35, 59))
                    .fechaProceso(LocalDateTime.of(2023, 12, 18, 0, 0, 0))
                    .formaPago("01")
                    .canal("06")
                    .build());

            pagoRepository.save(Pago.builder()
                    .nombreCliente("BERNAOLA ROMUCHO ZIRTAED ALIAN")
                    .codigo("20172129")
                    .descripcionPago("065 DERECHO CALIGRAFIADO FAC. EDUCAC.")
                    .importePagar(new BigDecimal("20.00"))
                    .importePagado(new BigDecimal("21.50"))
                    .oficina("0817")
                    .numeroMovimiento("626201")
                    .fechaPago(LocalDateTime.of(2023, 12, 18, 19, 35, 0))
                    .fechaProceso(LocalDateTime.of(2023, 12, 18, 0, 0, 0))
                    .formaPago("01")
                    .canal("06")
                    .build());

            pagoRepository.save(Pago.builder()
                    .nombreCliente("BERNAOLA ROMUCHO ZIRTAED ALIAN")
                    .codigo("20172129")
                    .descripcionPago("064 DERECHO CUADERNILLO FAC. EDUCAC.")
                    .importePagar(new BigDecimal("20.00"))
                    .importePagado(new BigDecimal("21.50"))
                    .oficina("0817")
                    .numeroMovimiento("626198")
                    .fechaPago(LocalDateTime.of(2023, 12, 18, 19, 34, 2))
                    .fechaProceso(LocalDateTime.of(2023, 12, 18, 0, 0, 0))
                    .formaPago("01")
                    .canal("06")
                    .build());

            pagoRepository.save(Pago.builder()
                    .nombreCliente("ITO YARMAS LUIS ALBERTO")
                    .codigo("20190860")
                    .descripcionPago("051 CARTA PRESENTACION 2 FAC. CONTAB.")
                    .importePagar(new BigDecimal("15.00"))
                    .importePagado(new BigDecimal("16.50"))
                    .oficina("0817")
                    .numeroMovimiento("626196")
                    .fechaPago(LocalDateTime.of(2023, 12, 18, 19, 30, 25))
                    .fechaProceso(LocalDateTime.of(2023, 12, 18, 0, 0, 0))
                    .formaPago("01")
                    .canal("06")
                    .build());

            System.out.println("Pagos seeded successfully. Total: " + pagoRepository.count());
        }
    }
}
