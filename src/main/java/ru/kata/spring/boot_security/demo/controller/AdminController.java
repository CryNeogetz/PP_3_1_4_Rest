package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;
    private final RoleService roleService;


    @Autowired
    public AdminController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }


    @GetMapping
    public String adminPage(@AuthenticationPrincipal User admin, Model model) {
        model.addAttribute("admin", admin);
        model.addAttribute("newUser", new User());
        model.addAttribute("roleList", roleService.findAll());
        model.addAttribute("allUsers", userService.allUsers());
        return "admin/admin";
    }

//    @GetMapping("/{id}")
//    public String showUser(@PathVariable("id") int id, Model model) {
//        model.addAttribute("user", userService.findUserById(id));
//        model.addAttribute("roleList", roleService.findAll());
//        return "/admin/edit";
//    }

    @PatchMapping("/{id}")
    public String updateUser(@ModelAttribute("user") User user) {

//        System.out.println(roles + roles);
//
//        List<Role> roleList = new ArrayList<>();
//        roleList.add(roleService.findAll().get(roles-1));
//        user.setRoles(roleList);

        userService.updateUserById(user);
        return "redirect:/admin";
    }

    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable("id") int id) {
        userService.deleteUser(id);
        return "redirect:/admin";
    }

    @PostMapping("/registration")
    public String createUser(@ModelAttribute("newUser") User user) {
        userService.saveUser(user);
        return "redirect:/admin";
    }

//    @PostMapping("/admin")
//    public String  deleteUser(@RequestParam(required = true, defaultValue = "" ) int userId,
//                              @RequestParam(required = true, defaultValue = "" ) String action,
//                              Model model) {
//        if (action.equals("delete")){
//            userService.deleteUser(userId);
//        }
//        return "redirect:/admin";
//    }
}
