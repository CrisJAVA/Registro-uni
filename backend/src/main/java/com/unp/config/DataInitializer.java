package com.unp.config;

import com.unp.entity.*;
import com.unp.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

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
    }
}
