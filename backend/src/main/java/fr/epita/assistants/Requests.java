package fr.epita.assistants;

import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

import fr.epita.assistants.myide.domain.entity.Feature;
import fr.epita.assistants.myide.domain.entity.Mandatory;
import fr.epita.assistants.myide.domain.entity.Project;
import fr.epita.assistants.myide.domain.service.ProjectService;

import org.apache.tomcat.jni.Proc;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;

// This annotation instructs Spring to initialize its configuration - which is needed to start a
// new application
@SpringBootApplication
// Indicates that this class contains RESTful methods to handle incoming HTTP requests
@RestController
public class Requests {

    static ProjectService projectService;
    static Project project;

    public static void main(String[] args) {
        SpringApplication.run(Requests.class, args);
        projectService = MyIde.init(null);
        project = projectService.load(Path.of(System.getProperty("user.dir")));
        System.out.println(Path.of(System.getProperty("user.dir")));
    }

    @GetMapping("/rootnode")
    public String rootnode(@RequestParam(name = "path") String path,HttpServletResponse response) {
        response.addHeader("Access-Control-Allow-Origin","*");
        try {
            Path p = Path.of(path).toAbsolutePath();
            if (projectService == null) projectService = MyIde.init(null);
            project = projectService.load(p);

            /*
            System.out.println(project.getRootNode().getPath());
            for (@NotNull Node n : project.getRootNode().getChildren()) {
                System.out.println(n.getPath());
            }
            */
        }
        catch (Exception e) {
            System.out.println("Could not set root node :");
            e.printStackTrace();
        }

        return "";
    }

    @GetMapping("/mvn/{text}")
    public String mvn(@PathVariable(name = "text") String command) {

        String[] parsed = command.split("-+");
        Feature.Type type = Mandatory.Features.Maven.COMPILE;

        switch (parsed[0]) {
            case "clean" :
                type = Mandatory.Features.Maven.CLEAN;
                break;
            case "test" :
                type = Mandatory.Features.Maven.TEST;
                break;
            case "package" :
                type = Mandatory.Features.Maven.PACKAGE;
                break;
            case "install" :
                type = Mandatory.Features.Maven.INSTALL;
                break;
            case "exec" :
                type = Mandatory.Features.Maven.EXEC;
                break;
            case "tree" :
                type = Mandatory.Features.Maven.TREE;
                break;
        }

        ArrayList<String> params = new ArrayList<>(List.of(parsed));
        params.remove(0);

        Feature.ExecutionReport report = projectService.execute(project, type, params);
        System.out.println("Command: " + type + " " + parsed[0] + "\tParams: " + params);

        return "{\n" +
                "\tSuccess : " + report.isSuccess() +
                "\n\tOutput : \"" + "MVN " + type + ": " + report.isSuccess() + "\"" +
                "\n}";
    }

    @GetMapping("/git/{text}")
    public String git(@PathVariable(name = "text") String command) {

        String[] parsed = command.split("-+");
        Feature.Type type = Mandatory.Features.Git.ADD;

        switch (parsed[0]) {
            case "commit" :
                type = Mandatory.Features.Git.COMMIT;
                break;
            case "pull" :
                type = Mandatory.Features.Git.PULL;
                break;
            case "push" :
                type = Mandatory.Features.Git.PUSH;
                break;
        }

        ArrayList<String> params = new ArrayList<>(List.of(parsed));
        params.remove(0);

        Feature.ExecutionReport report = projectService.execute(project, type, params);
        System.out.println("Command: " + type + " " + parsed[0] + "\tParams: " + params);

        return "{\n" +
                "\tSuccess : " + report.isSuccess() +
                "\n\tOutput : \"" + "GIT " + type + ": " + report.isSuccess() + "\"" +
                "\n}";
    }

    @GetMapping("/execute")
    public String execute(@RequestParam(name = "command") String command, HttpServletResponse response) {
        response.addHeader("Access-Control-Allow-Origin","*");
        Process process = null;
        String output = "Error";

        try {
            String[] parsed = command.split("-+");
            command = String.join(" ", parsed);
            /*
            ProcessBuilder processBuilder = new ProcessBuilder("bash", "-c", command);
            processBuilder.inheritIO();
            processBuilder.directory(project.getRootNode().getPath().toFile());
            // processBuilder.start();

            System.out.println(processBuilder.command());
            */

            process = Runtime.getRuntime().exec("cmd /c " + command, null, project.getRootNode().getPath().toFile());
            process.waitFor();

            output = new String(process.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
        }
        catch (Exception e) {
            e.printStackTrace();
        }

        return "{\n" +
                "\t\"Success\": " + (process != null && process.exitValue() == 0) +
                "\n\t\"Output\": \"" + output + "\"" +
                "\n}";
    }
}
