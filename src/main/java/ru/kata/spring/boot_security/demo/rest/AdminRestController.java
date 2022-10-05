package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api")
public class AdminRestController {

    private final UserService userService;
    private final RoleService roleService;


    @Autowired
    public AdminRestController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }


    @GetMapping("/admin")
    public ResponseEntity<List<Role>> getUsers() {

        List<User> allUsers = userService.allUsers();
        List<Role> roles = roleService.findAll();

        return allUsers != null ? new ResponseEntity<>(roles, HttpStatus.OK) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
//
//    @PatchMapping("/{id}")
//    public String updateUser(@ModelAttribute("user") User user) {
//
//        userService.updateUserById(user);
//        return "redirect:/admin";
//    }
//
//    @DeleteMapping("/{id}")
//    public String deleteUser(@PathVariable("id") int id) {
//        userService.deleteUser(id);
//        return "redirect:/admin";
//    }
//
//    @PostMapping("/registration")
//    public String createUser(@ModelAttribute("newUser") User user) {
//        userService.saveUser(user);
//        return "redirect:/admin";
//    }

}
