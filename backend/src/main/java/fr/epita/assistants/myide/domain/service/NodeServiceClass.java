package fr.epita.assistants.myide.domain.service;

import fr.epita.assistants.myide.domain.entity.Node;
import fr.epita.assistants.myide.domain.entity.NodeClass;
import fr.epita.assistants.myide.domain.entity.Project;
import fr.epita.assistants.myide.domain.entity.ProjectClass;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import java.nio.charset.StandardCharsets;

public class NodeServiceClass implements NodeService {

    ProjectClass project;

    public NodeServiceClass(ProjectClass project) {
        this.project = project;
    }

    @Override
    public Node update(Node node, int from, int to, byte[] insertedContent) {
        try {
            File file = node.getPath().toFile();
            StringBuilder content = new StringBuilder();

            BufferedReader reader = new BufferedReader(new FileReader(file));
            String currentLine;
            while ((currentLine = reader.readLine()) != null) {
                content.append(currentLine).append("\n");
            }
            reader.close();
            content.replace(from, to, new String(insertedContent, StandardCharsets.UTF_8));

            BufferedWriter writer = new BufferedWriter(new FileWriter(file));
            writer.write(content.toString());
            writer.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return node;
    }

    @Override
    public boolean delete(Node node) {
        File file = new File(String.valueOf(node.getPath()));

        if (node.isFolder()) {
            for (Node childrenNode : node.getChildren()) {
                delete(childrenNode);
            }
        }

        boolean deleted = file.delete();
        project.setRootNode(new NodeClass(project.getRootNode().getPath(), project.getRootNode().getType()));

        return deleted;
    }

    @Override
    public Node create(Node folder, String name, Node.Type type) {
        NodeClass node = null;
        try {
            File f = new File(folder.getPath() + "/" + name);
            if (!f.exists()) {
                System.out.println("\tCreating file: " + f.getPath());
                boolean success = (type == Node.Types.FOLDER) ? f.mkdir() : f.createNewFile();
                if (!success) throw new RuntimeException("Could not create file " + f.getPath());

                node = new NodeClass(Paths.get(f.getPath()), type);
                folder.getChildren().add(node);
            }
            else throw new RuntimeException("File already exists");
        } catch (Exception e) {
            e.printStackTrace();
        }

        return node;
    }

    @Override
    public Node move(Node nodeToMove, Node destinationFolder) {
        try {
            if (!destinationFolder.isFolder())
                throw new RuntimeException("Destination is not a folder");

            // Source & destination files.
            Path src = nodeToMove.getPath();
            Path target = Path.of(destinationFolder.getPath().toString() + '/' + nodeToMove.getPath().toFile().getName());

            // Move file from one location to another.
            Files.move(src, target, StandardCopyOption.REPLACE_EXISTING);

            destinationFolder.getChildren().add(nodeToMove);

        } catch (IOException ex) {
            ex.printStackTrace();
        }

        project.setRootNode(new NodeClass(project.getRootNode().getPath(), project.getRootNode().getType()));
        return nodeToMove;
    }
}
