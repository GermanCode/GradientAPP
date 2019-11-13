-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         10.3.14-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win64
-- HeidiSQL Versión:             9.4.0.5125
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Volcando estructura de base de datos para gradientapp
CREATE DATABASE IF NOT EXISTS `sanisidr_GradientAPP` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `sanisidr_GradientAPP`;

-- Volcando estructura para tabla gradientapp.calificacion
CREATE TABLE IF NOT EXISTS `calificacion` (
  `id_Calificacion` int(11) NOT NULL,
  `fk_Ejercicio` int(11) NOT NULL,
  `calificacion` int(11) NOT NULL,
  PRIMARY KEY (`id_Calificacion`),
  KEY `fk_Ejer_Cali` (`fk_Ejercicio`),
  CONSTRAINT `fk_Ejer_Cali` FOREIGN KEY (`fk_Ejercicio`) REFERENCES `ejercicios` (`id_Ejercicio`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- La exportación de datos fue deseleccionada.
-- Volcando estructura para tabla gradientapp.curso
CREATE TABLE IF NOT EXISTS `curso` (
  `id_Curso` int(11) NOT NULL,
  `desc_Curso` varchar(50) NOT NULL,
  PRIMARY KEY (`id_Curso`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- La exportación de datos fue deseleccionada.
-- Volcando estructura para tabla gradientapp.docente
CREATE TABLE IF NOT EXISTS `docente` (
  `id_Docente` int(11) NOT NULL,
  `fk_Persona` int(11) NOT NULL,
  PRIMARY KEY (`id_Docente`),
  KEY `fk_doc_per` (`fk_Persona`),
  CONSTRAINT `fk_doc_per` FOREIGN KEY (`fk_Persona`) REFERENCES `persona` (`id_Persona`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- La exportación de datos fue deseleccionada.
-- Volcando estructura para tabla gradientapp.ejercicios
CREATE TABLE IF NOT EXISTS `ejercicios` (
  `id_Ejercicio` int(11) NOT NULL AUTO_INCREMENT,
  `fk_Docente` int(11) NOT NULL,
  `fecha_Ini` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `fecha_Fin` date NOT NULL,
  `func_Obj` varchar(50) NOT NULL,
  `desc_Ejer` varchar(200) NOT NULL,
  `fk_Curso` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_Ejercicio`),
  KEY `fk_Doce_Ejer` (`fk_Docente`),
  KEY `fk_Cur_Ejer` (`fk_Curso`),
  CONSTRAINT `fk_Cur_Ejer` FOREIGN KEY (`fk_Curso`) REFERENCES `curso` (`id_Curso`),
  CONSTRAINT `fk_Doce_Ejer` FOREIGN KEY (`fk_Docente`) REFERENCES `docente` (`id_Docente`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;

-- La exportación de datos fue deseleccionada.
-- Volcando estructura para tabla gradientapp.estudiante
CREATE TABLE IF NOT EXISTS `estudiante` (
  `id_Estudiante` int(11) NOT NULL,
  `fk_Persona` int(11) NOT NULL,
  `fk_Curso` int(11) NOT NULL,
  PRIMARY KEY (`id_Estudiante`),
  KEY `fk_Cur_Est` (`fk_Curso`),
  KEY `fk_Per_Est` (`fk_Persona`),
  CONSTRAINT `fk_Cur_Est` FOREIGN KEY (`fk_Curso`) REFERENCES `curso` (`id_Curso`),
  CONSTRAINT `fk_Per_Est` FOREIGN KEY (`fk_Persona`) REFERENCES `persona` (`id_Persona`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- La exportación de datos fue deseleccionada.
-- Volcando estructura para tabla gradientapp.persona
CREATE TABLE IF NOT EXISTS `persona` (
  `id_Persona` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(150) NOT NULL,
  `telefono` varchar(50) DEFAULT NULL,
  `curso` enum('MD1','MD2') DEFAULT NULL,
  `password` varchar(200) NOT NULL,
  PRIMARY KEY (`id_Persona`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- La exportación de datos fue deseleccionada.
-- Volcando estructura para tabla gradientapp.rol
CREATE TABLE IF NOT EXISTS `rol` (
  `id_Rol` int(11) NOT NULL,
  `desc_Rol` varchar(50) NOT NULL,
  PRIMARY KEY (`id_Rol`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- La exportación de datos fue deseleccionada.
-- Volcando estructura para tabla gradientapp.roles_persona
CREATE TABLE IF NOT EXISTS `roles_persona` (
  `fk_Rol_Persona` int(11) NOT NULL DEFAULT 0,
  `fk_Persona_Rol` int(11) NOT NULL,
  PRIMARY KEY (`fk_Rol_Persona`,`fk_Persona_Rol`),
  KEY `fk_per_rol` (`fk_Persona_Rol`),
  CONSTRAINT `fk_per_rol` FOREIGN KEY (`fk_Persona_Rol`) REFERENCES `persona` (`id_Persona`),
  CONSTRAINT `fk_rol_per` FOREIGN KEY (`fk_Rol_Persona`) REFERENCES `rol` (`id_Rol`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- La exportación de datos fue deseleccionada.
-- Volcando estructura para tabla gradientapp.sessions
CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- La exportación de datos fue deseleccionada.
-- Volcando estructura para tabla gradientapp.soluciones
CREATE TABLE IF NOT EXISTS `soluciones` (
  `fk_Ejercicio` int(11) NOT NULL,
  `fk_Estudiante` int(11) NOT NULL,
  `img_Solucion` longblob NOT NULL,
  `fec_Creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`fk_Ejercicio`,`fk_Estudiante`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- La exportación de datos fue deseleccionada.
-- Volcando estructura para disparador gradientapp.tr_reg_est
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `tr_reg_est` AFTER INSERT ON `persona` FOR EACH ROW BEGIN
insert into estudiante set id_Estudiante = new.id_Persona, fk_Persona = new.id_Persona, fk_Curso = new.curso;
insert into roles_persona set fk_Rol_Persona = '1',  fk_Persona_Rol = new.id_Persona;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
