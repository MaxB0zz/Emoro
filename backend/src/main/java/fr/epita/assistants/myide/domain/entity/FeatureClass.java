package fr.epita.assistants.myide.domain.entity;

import org.eclipse.jgit.api.Git;

import java.io.IOException;
import java.io.*;
import java.nio.file.Path;
import java.util.ArrayList;

import static fr.epita.assistants.myide.domain.entity.Mandatory.Features.Maven.*;
import static fr.epita.assistants.myide.domain.entity.Mandatory.Features.Git.*;
import static fr.epita.assistants.myide.domain.entity.Mandatory.Features.Any.*;

public class FeatureClass implements Feature {
    Type type;

    public FeatureClass(Type type_) {
        type = type_;
    }

    public boolean cleanup(Node node) {
        String path1 = node.getPath() + "/.myideignore";
        File file = Path.of(path1).toFile();

        if (file == null) return true;

        try {
            BufferedReader reader = new BufferedReader(new FileReader(file));
            String currentLine;

            while ((currentLine = reader.readLine()) != null) {
                for (Node child: node.getChildren()) {
                    file_traversal(child, currentLine);
                }
            }
            reader.close();
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        return true;
    }

    void file_traversal(Node node, String to_delete) {
        if (node.isFolder()) {
            for(Node child: node.getChildren()) {
                file_traversal(child, to_delete);
            }
        }

        if (node.getPath().toFile().getName().matches(to_delete)) {
            if (node.isFile()) {
                node.getPath().toFile().delete();
            }

            if (node.isFolder()) {
                deleteFolder(node);
            }
        }
    }

    void deleteFolder(Node folder) {
        for (Node child: folder.getChildren()) {
            if (child.isFolder())
                deleteFolder(child);
            else
                child.getPath().toFile().delete();
        }

        folder.getPath().toFile().delete();
    }

    public boolean dist(Node node) {
        if (node == null) return false;

        try {
            cleanup(node);

            ProcessBuilder processBuilder = new ProcessBuilder();
            processBuilder.command("bash", "-c", "cd " + node.getPath() + "; cd ..; zip -r " + node.getPath().toFile().getName() + " " + node.getPath() + "/*");
            Process process = processBuilder.start();

            process.waitFor();
            
            return (process.exitValue() == 0);
        }
        catch (Exception e) {
            return false;
        }
    }

    public boolean search(Path path) {
        return false;
    }

    @Override
    public ExecutionReport execute(Project project, Object... params) {
        var executionReportSuccess = new ExecutionReport() {
            @Override
            public boolean isSuccess() {
                return true;
            }
        };
        var executionReportFail = new ExecutionReport() {
            @Override
            public boolean isSuccess() {
                return false;
            }
        };

        Git rep = null;
        try {
            Process process = null;
            ArrayList<String> files = new ArrayList<>(); // = (String[]) params;
            for (Object param : params) {
                files.add(param.toString());
                System.out.println(param);
            }

            if (COMPILE.equals(type)) {
                String cmd = "mvn compile";
                for (String file : files) {
                    cmd += " " + file;
                }
                ProcessBuilder processBuilder = new ProcessBuilder("cmd /c " + cmd);
                processBuilder.directory(project.getRootNode().getPath().toFile());
                process = processBuilder.start();
            }
            if (CLEAN.equals(type)) {
                String cmd = "mvn clean";
                for (String file : files) {
                    cmd += " " + file;
                }
                ProcessBuilder processBuilder = new ProcessBuilder("cmd /c " + cmd);
                processBuilder.directory(project.getRootNode().getPath().toFile());
                process = processBuilder.start();
            }
            if (TEST.equals(type)) {
                String cmd = "mvn test";
                for (String file : files) {
                    cmd += " " + file;
                }
                ProcessBuilder processBuilder = new ProcessBuilder("cmd /c " + cmd);
                processBuilder.directory(project.getRootNode().getPath().toFile());
                process = processBuilder.start();
            }
            if (PACKAGE.equals(type)) {
                String cmd = "mvn package";
                for (String file : files) {
                    cmd += " " + file;
                }
                ProcessBuilder processBuilder = new ProcessBuilder("cmd /c " + cmd);
                processBuilder.directory(project.getRootNode().getPath().toFile());
                process = processBuilder.start();
            }
            if (INSTALL.equals(type)) {
                String cmd = "mvn install";
                for (String file : files) {
                    cmd += " " + file;
                }
                ProcessBuilder processBuilder = new ProcessBuilder("cmd /c " + cmd);
                processBuilder.directory(project.getRootNode().getPath().toFile());
                process = processBuilder.start();
            }
            if (EXEC.equals(type)) {
                String cmd = "mvn exec";
                for (String file : files) {
                    cmd += " " + file;
                }
                ProcessBuilder processBuilder = new ProcessBuilder("cmd /c " + cmd);
                processBuilder.directory(project.getRootNode().getPath().toFile());
                process = processBuilder.start();
            }
            if (TREE.equals(type)) {
                String cmd = "mvn tree";
                for (String file : files) {
                    cmd += " " + file;
                }
                ProcessBuilder processBuilder = new ProcessBuilder("cmd /c " + cmd);
                processBuilder.directory(project.getRootNode().getPath().toFile());
                process = processBuilder.start();
            }

            if (process != null) {
                process.waitFor();
                if (process.exitValue() != 0) return executionReportFail; //throw new IOException("Maven command went wrong : " + process.exitValue());
                return executionReportSuccess;
            }



            if (CLEANUP.equals(type) && !cleanup(project.getRootNode())) {
                // throw new IOException("cleanup gone wrong");
                return executionReportFail;
            }
            if (DIST.equals(type) && !dist(project.getRootNode())) {
                // throw new IOException("dist gone wrong");
                return executionReportFail;
            }
            if (SEARCH.equals(type) && !search(project.getRootNode().getPath())) {
                // throw new IOException("search gone wrong");
                return executionReportFail;
            }


            if (PULL.equals(type)) {
                rep = Git.open(project.getRootNode().getPath().toFile());
                rep.pull().call();
                rep.close();
            }
            if (ADD.equals(type)) {
                rep = Git.open(project.getRootNode().getPath().toFile());
                for (var file : params) {
                    rep.add().addFilepattern(file.toString());
                }
                rep.add().call();
                rep.close();
            }
            if (COMMIT.equals(type)) {
                rep = Git.open(project.getRootNode().getPath().toFile());
                rep.commit().setMessage("Commited all").call();
                rep.close();
            }
            if (PUSH.equals(type)) {
                rep = Git.open(project.getRootNode().getPath().toFile());
                rep.push().call();
                rep.close();
            }
        } catch (Exception e) {
            // e.printStackTrace();
            // return () -> false;
            return executionReportFail;
        }
        finally {
            if (rep != null)
                rep.close();
        }
        // return () -> true;
        return executionReportSuccess;
    }

    @Override
    public Type type() {
        return type;
    }
}
