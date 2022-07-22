package fr.epita.assistants.myide.domain.entity;

import javax.validation.constraints.NotNull;
import java.io.File;
import java.util.*;
import java.nio.file.Path;

import static fr.epita.assistants.myide.domain.entity.Mandatory.Aspects.*;

public class ProjectClass implements Project {

    Node rootNode;
    // NodeService nodeService;
    Set<Aspect> aspects;
    List<@NotNull Feature> features;

    public ProjectClass(/*Path path, */Node rootNode) {
        this.rootNode = rootNode;
        Path path = rootNode.getPath();
        // rootNode = new NodeClass(path, null);
        features = new ArrayList<>();
        aspects = new HashSet<>();
        aspects.add(new AspectClass(ANY));

        File file = path.toFile();
        if (file.isFile()) {
            file = new File(file.getParent());
        }

        String[] files = file.list();
        for (String f : files) {
            if (f.equals(".git")) {
                AspectClass ne = new AspectClass(GIT);
                aspects.add(ne);
                features.addAll(ne.getFeatureList());
            }
            if (f.equals("pom.xml")) {
                AspectClass ne = new AspectClass(MAVEN);
                aspects.add(ne);
                features.addAll(ne.getFeatureList());
            }
        }
        AspectClass ne = new AspectClass(ANY);
        aspects.add(ne);
        features.addAll(ne.getFeatureList());
    }

    @Override
    public Node getRootNode() {
        return rootNode;
    }
    public void setRootNode(Node newRoot) {
        this.rootNode = newRoot;
    }

    @Override
    public Set<Aspect> getAspects() {
        return aspects;
    }

    @Override
    public Optional<Feature> getFeature(Feature.Type featureType) {
        for(Feature feature : features) {
            if (feature.type() == featureType) {
                return Optional.of(feature);
            }
        }
        return null;
    }

    @Override
    public List<@NotNull Feature> getFeatures() {
        return Project.super.getFeatures();
    }
}
