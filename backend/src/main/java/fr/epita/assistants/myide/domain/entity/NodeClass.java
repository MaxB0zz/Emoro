package fr.epita.assistants.myide.domain.entity;

import javax.validation.constraints.NotNull;
import java.io.File;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

public class NodeClass implements Node {

    Path path;
    Type type;
    List<Node> children = new ArrayList<>();

    public NodeClass(Path path, Type type) {
        this.path = path;

        File file = path.toFile();
        if (type == null) {
            type = file.isFile() ? Types.FILE : Types.FOLDER ;
        }
        this.type = type;

        if (type == Types.FOLDER) {
            String[] files = file.list();
            if (files == null) return;

            for (String f : files) {
                this.children.add(new NodeClass(path.resolve(f), null));
            }
        }
    }

    @Override
    public Path getPath() {
        return path;
    }

    @Override
    public Type getType() {
        return type;
    }

    @Override
    public List<@NotNull Node> getChildren() {
        return children;
    }

    public void print() {
        if (this == null) return;
        System.out.println(this.getPath());

        if (this.getChildren() == null) return;

        for (Node n : this.getChildren()) {
            if (n == null) return;
            ((NodeClass) n).print();
        }
    }
}
